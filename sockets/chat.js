module.exports = function(io){
	var crypto = require('crypto');
    var sockets = io.sockets;
    var online = {};

    sockets.on('connection', function(client){
		var session = client.handshake.session;
		var usuario = session.usuario;

        online[usuario.email] = usuario.email;
        for(var email in online){
            client.emit('notify-online', email);
            client.broadcast.emit('notify-online', email);
        }

		client.on('send-server', function(msg){
			var sala = session.sala;
            var data = {email: usuario.email, sala: sala};
		    msg = "<b>"+usuario.nome+":</b> "+msg+"<br/>";
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
        });
        client.on('disconnect', function(){
            var sala = session.sala;
            var msg = "<b>"+ usuario.nome + ": </b> saiu.<br>";
            client.broadcast.emit('notify-offline', usuario.email);
            sockets.in(sala).emit('send-client', msg);
            delete online[usuario.email];
            client.leave(session.sala);
        });
    });
}