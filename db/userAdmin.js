const mongoose = require('mongoose');
const User = mongoose.model('user');
const uuidv4 = require('uuid/v4');

const db = mongoose.connection;

//Create admin user on init
db.on('connected', () => {
	User.findOne({ username: 'admin'}).then(user => {
		if (user) {
			console.log('admin уже создан, пароль 123');
		} else {
			const permission = {
				chat: { C:true, R:true, U:true, D:true },
				news: { C:true, R:true, U:true, D:true },
				setting: { C:true, R:true, U:true, D:true }
			};

			const newUser = new User();
			newUser.username = 'admin';
			newUser.surName = 'admin';
			newUser.firstName = 'admin';
			newUser.middleName = 'admin';
			newUser.image = '';
			newUser.access_token = uuidv4();
			newUser.permission = permission;
			newUser.permissionId = '1';
			newUser.setPassword('123');
			newUser.save().then(user => {
				console.log('admin создан, пароль 123');
			}).catch(err => {
				console.log(err);
			});
		}
	});
});
