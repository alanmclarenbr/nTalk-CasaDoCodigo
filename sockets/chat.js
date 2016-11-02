module.exports = function(io){
	var crypto = require('crypto');
    var redis = require('redis').createClient();
    var sockets = io.sockets;

    sockets.on('connection', function(client){
		var session = client.handshake.session;
		var usuario = session.usuario;

        redis.sadd('online', usuario.email, function (error) {
            redis.smembers('online', function (error, emails) {
                emails.forEach(function (email) {
                    client.emit('notify-online', email);
                    client.broadcast.emit('notify-online', email);
                });
            });
        });

		client.on('send-server', function(msg){
			var sala = session.sala;
            var data = {email: usuario.email, sala: sala};
		    msg = "<b>"+usuario.nome+":</b> "+msg+"<br/>";
            redis.lpush(sala, msg);
			client.broadcast.emit('new-message', data);
            io.sockets.in(sala).emit('send-client', msg);
		});
        client.on('join', function (sala) {
            if(!sala){
                var timestamp = new Date().toString();
                var md5 = crypto.createHash('md5');
                sala = md5.update(timestamp).digest('hex');
            }
            session.sala = sala;
            client.join(sala);

            var msg = '<b>'+usuario.nome+':</b> entrou.<br/>';
            redis.lpush(sala,msg, function (error, res) {
                redis.lrange(sala, 0, -1, function (error, msgs) {
                    msgs.forEach(function (msg) {
                        sockets.in(sala).emit('send-client', msg);
                    });
                });
            });
        });
        client.on('disconnect', function(){
            var sala = session.sala;
            var msg = "<b>"+ usuario.nome + ": </b> saiu.<br>";
            redis.lpush(sala, msg);
            client.broadcast.emit('notify-offline', usuario.email);
            sockets.in(sala).emit('send-client', msg);
            redis.srem('online', usuario.email);
            client.leave(session.sala);
        });
    });
}