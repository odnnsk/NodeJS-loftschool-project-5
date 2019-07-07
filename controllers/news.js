const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const uuidv4 = require('uuid/v4');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');



const resultItemConverter = (item) => {
	return {
		id: item._id,
		username: item.username,
		surName: item.surName,
		firstName: item.firstName,
		middleName: item.middleName,
		image: item.image,
		access_token: item.access_token,
		permission: item.permission,
		permissionId: item._id,
		password: item.password
	}
};


const errorHandler = (err, res) => {
	res.status(400).json({
		statusMessage: 'Error',
		data: { status: 400, message: err.message },
	});
};




module.exports.newNews = (req, res, next) => {
	const data = JSON.parse(req.body);
	const { userId, theme, text, date } = data;

	
	console.log(data);
	console.log(userId);
	console.log(theme);
	console.log(text);
	console.log(date);

	
	// User.findOne({ username }).then(user => {
	// 	if (user) {
	// 		// res.status(201).json({ statusMessage: 'Ok', data: 'result' });
	// 		return res.json({ msg: 'Пользователь с таким логином уже существует'});
	// 		// throw new Error('Такой пользователь уже существует!');
	// 	} else {
	// 		const newUser = new User();
	// 		// newUser.id = uuidv4();
	// 		newUser.username = username;
	// 		newUser.surName = surName;
	// 		newUser.firstName = firstName;
	// 		newUser.middleName = middleName;
	// 		newUser.image = '';
	// 		newUser.access_token = uuidv4();
	// 		newUser.permission = permission;
	// 		newUser.permissionId = '2';
	// 		newUser.setPassword(password);
	// 		newUser
	// 			.save()
	// 			.then(user => {
	// 				req.logIn(user, err => {
	// 					if (err) next(err);
	// 					// return res.json(user);
	// 					return res.json(resultItemConverter(user));
	// 				});
	// 			})
	// 			.catch(err => {
	// 				errorHandler(err, res);
	// 			});
	// 	}
	// });
};

module.exports.getNews = (req, res, next) => {
	return res.json({ msg: 'OK' });
};

module.exports.updateNews = (req, res, next) => {

};

module.exports.deleteNews = (req, res, next) => {

};










module.exports.token = (req, res, next) => {
	const token = req.cookies.token;
	if (!!token) {
		User.findOne({ token }).then(user => {
			if (user) {
				req.logIn(user, err => {
					if (err) next(err);
					return res.json(resultItemConverter(user));
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
					return res.json(resultItemConverter(user));
				});
			} else {
				return res.json(resultItemConverter(user));
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
						// return res.json(user);
						return res.json(resultItemConverter(user));
					});
				})
				.catch(err => {
					errorHandler(err, res);
				});
		}
	});
};

module.exports.getUsers = (req, res, next) => {
	// User.find({permissionId: "2"}).then(users => {
	User.find({ username: { $ne: 'admin' } }).then(users => {
		return res.status(200).json(users.map((item) => resultItemConverter(item)));
	}).catch(err => {
		errorHandler(err, res);
	});
};

module.exports.saveUserImage = async (req, res, next) => {
	const id = req.params.id;
	// parse a form with file upload. multipart/form-data
	const form = new formidable.IncomingForm();
	const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'users', id);

	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true })
	}

	form.uploadDir = uploadDir;

	// console.log(form);

	form.parse(req, (err, fields, files) => {
		if (err) return errorHandler(err, res);

		const file = files[id];

		if (file.name === '' || !file.size === 0) {
			fs.unlinkSync(file.path);

			return res.status(400).json({
				statusMessage: 'Error',
				data: { status: 400, message: 'File not saved' },
			});
		}

		const fileName = path.join(uploadDir, file.name);

		fs.rename(file.path, fileName, async (err) => {
			if (err) return errorHandler(err, res);

			//Save data
			let data = {};
			const user = await User.findById(id);

			data.image = `./assets/img/users/${id}/${file.name}`;

			// console.log(data);

			user.set(data);

			const result = await user.save();

			return res.json(resultItemConverter(result));
		});

	});
};

module.exports.updateUser = async (req, res, next) => {
	const id = req.params.id;
	const data =  JSON.parse(req.body);
	const user = await User.findById(id);

	if(data.oldPassword && !user.validPassword(data.oldPassword)){
		return res.status(400).json({
			statusMessage: 'Error',
			data: { status: 400, message: 'Incorrect password' },
		});
	}

	user.set(data);
	if(data.password && data.oldPassword){
		user.setPassword(data.password);
	}

	const result = await user.save();

	return res.json(resultItemConverter(result));
};

module.exports.updateUserPermission = async (req, res, next) => {
	const id = req.params.id;
	const data =  JSON.parse(req.body);
	const user = await User.findById(id);

	user.set(data);

	const result = await user.save();

	return res.json(resultItemConverter(result));
};

module.exports.delUserById = (req, res, next) => {
	const id = req.params.id;

	console.log(req.params);

	User.findByIdAndRemove(id).then(() => {
		return res.status(200).json({
			statusMessage: 'OK',
			data: { status: 200, message: 'Пользователь удален' },
		});
	}).catch(err => {
		errorHandler(err, res);
	});
};
