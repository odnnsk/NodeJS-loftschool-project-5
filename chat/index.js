//All users
const users = {};

const ws = io => {
	io.on('connection', socket => {
		//Create user object
		users[socket.id] = {};
		users[socket.id].username = socket.handshake.headers['username'];
		users[socket.id].id = socket.id;

		socket.json.emit('all users', users);
		socket.broadcast.json.emit('new user', users[socket.id]);

		//Send message
		socket.on('chat message', (msg, toUserId) => {
			socket.to(toUserId).emit('chat message', msg, socket.id);
		});

		//Disconect
		socket.on('disconnect', (data) => {
			socket.broadcast.json.emit('delete user', users[socket.id].id);
			delete users[socket.id];
		});
	});
};



module.exports = ws;
