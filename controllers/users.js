const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const uuidv4 = require('uuid/v4');


module.exports.token = (req, res, next) => {
	const token = req.cookies.token;
	if (!!token) {
		User.findOne({ token }).then(user => {
			if (user) {
				req.logIn(user, err => {
					if (err) next(err);
					return res.json(user);
				});
			}
			next();
		});
	} else {
		next();
	}
};

module.exports.login = (req, res, next) => {
	const data = JSON.parse(req.body);
	const { username, password, remembered } = data;

	req.body = data;

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(400).json({
				statusMessage: 'Error',
				data: { status: 400, message: info },
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			if (req.body.remembered) {
				const token = uuidv4();
				user.setToken(token);
				user.save().then(user => {
					res.cookie('token', token, {
						maxAge: 7 * 60 * 60 * 1000,
						path: '/',
						httpOnly: true,
					});
					return res.json(user);
				});
			} else {
				return res.json(user);
			}
		});
	})(req, res, next);
};

module.exports.registration = (req, res, next) => {
	const data = JSON.parse(req.body);
	const { username, surName, firstName, middleName, password, permission } = data;
	
	User.findOne({ username }).then(user => {
		if (user) {
			// res.status(201).json({ statusMessage: 'Ok', data: 'result' });
			return res.json({ msg: 'Пользователь с таким логином уже существует'});
			// throw new Error('Такой пользователь уже существует!');
		} else {
			const newUser = new User();
			// newUser.id = uuidv4();
			newUser.username = username;
			newUser.surName = surName;
			newUser.firstName = firstName;
			newUser.middleName = middleName;
			newUser.image = '';
			newUser.access_token = uuidv4();
			newUser.permission = permission;
			newUser.permissionId = '2';
			newUser.setPassword(password);
			newUser
				.save()
				.then(user => {
					req.logIn(user, err => {
						if (err) next(err);
						return res.json(user);
					});
				})
				.catch(err => {
					res.status(400).json({
						statusMessage: 'Error',
						data: { status: 400, message: err.message },
					});
				});
		}
	});
};

module.exports.logout = (req, res, next) => {

};