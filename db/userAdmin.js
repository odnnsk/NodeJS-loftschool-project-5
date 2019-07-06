const mongoose = require('mongoose');
const User = mongoose.model('user');
const uuidv4 = require('uuid/v4');

const db = mongoose.connection;
db.on('connected', () => {
	console.log('DB CONNECT')
});