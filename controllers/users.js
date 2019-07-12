const mongoose = require('mongoose');
const User = mongoose.model('user');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const makeJwtToken = require('../libs/makeJwtToken');
const checkPermission = require('../libs/checkPermission');
const Jimp = require('jimp');


const resultItemConverter = (item) => {
	return {
		id: item._id,
		username: item.username,
		surName: item.surName,
		firstName: item.firstName,
		middleName: item.middleName,
		image: item.image,
		access_token: makeJwtToken(item),
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

const errorAccessHandler = () => {
	res.status(403).json({
		statusMessage: 'No access',
		data: { status: 403, message: 'No access' },
	});
};


module.exports.token = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(400).json({
				statusMessage: 'Error',
				data: { status: 400, message: info },
			});
		}

		req.logIn(user, err => {
			if (err) errorHandler(err, res);
			return res.json(resultItemConverter(user));
		});

	})(req, res, next);
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

		req.logIn(user, err => {
			if (err) errorHandler(err, res);

			if (req.body.remembered) {
				const access_token = makeJwtToken(user);

				res.cookie('access_token', access_token, {
					maxAge: 7 * 60 * 60 * 1000,
					path: '/',
					httpOnly: false,
				});
				return res.json(resultItemConverter(user));
			} else {
				// console.log(resultItemConverter(user));
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
			return res.json({ msg: 'Пользователь с таким логином уже существует'});
			// throw new Error('Такой пользователь уже существует!');
		} else {
			const newUser = new User();
			newUser.username = username;
			newUser.surName = surName;
			newUser.firstName = firstName;
			newUser.middleName = middleName;
			newUser.image = '';
			newUser.permission = permission;
			newUser.permissionId = '2';
			newUser.setPassword(password);
			newUser.save().then(user => {

				req.logIn(user, err => {
					if (err) errorHandler(err, res);
					return res.json(resultItemConverter(user));
				});

			})
			.catch(err => {
				errorHandler(err, res);
			});
		}
	}).catch(err => {
		errorHandler(err, res);
	});
};

module.exports.getUsers = (req, res, next) => {
	checkPermission('setting', 'R', req.user.permission, access => {
		if(!access) return errorAccessHandler();
	});

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

	// console.log(process.cwd());
	// console.log(__dirname);

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

			//Image resize
			Jimp.read(fileName).then(img => {
				const w = img.bitmap.width; //width of the image
				const h = img.bitmap.height;

				if(w !== h || w !== 370 || h !== 370){
					return img.cover(370, 370).write(fileName);
				}
			}).catch(err => {
				next(err);
			});

			//Save data
			let data = {};
			const user = await User.findById(id);
			
			data.image = `/assets/img/users/${id}/${file.name}`;
			// data.image = path.join(process.cwd(), 'public', 'assets', 'img', 'users', id, file.name);

			user.set(data);
			const result = await user.save();

			const response = {
				path: result.image
			};

			return res.status(200).json(response);
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
	checkPermission('setting', 'U', req.user.permission, access => {
		if(!access) return errorAccessHandler();
	});

	const id = req.params.id;
	const data =  JSON.parse(req.body);
	const user = await User.findById(id);

	user.set(data);

	const result = await user.save();

	return res.json(resultItemConverter(result));
};

module.exports.delUserById = (req, res, next) => {
	checkPermission('setting', 'D', req.user.permission, access => {
		if(!access) return errorAccessHandler();
	});

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