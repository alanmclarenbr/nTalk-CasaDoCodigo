module.exports = function(io){
	io.sockets.on('connection', function(client){
		console.log("io.sockets.on");
		var session = client.handshake.session;
		var usuario = session.usuario;
		client.on('send-server', function(msg){
			msg = "<b>"+usuario.nome+":</b> "+msg+"<br/>";
			client.emit('send-client', msg);
			client.broadcast.emit('send-client', msg);
		});
	});
}