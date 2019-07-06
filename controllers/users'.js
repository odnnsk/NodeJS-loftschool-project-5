const User = require('../db/models/user');
const Joi = require('@hapi/joi');


const schema = Joi.object().keys({
	username: Joi.string().alphanum().min(3).max(30),
	password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
	email: Joi.string().email({ minDomainSegments: 2 })
});

const resultItemConverter = (item) => {
	return {
		id: item.id,
		username: item.username,
		email: item.email
	}
};

exports.add = ({ username, email, password }) => new Promise(async (resolve, reject) => {
	try {
		const { error, value } = Joi.validate({ username, email, password }, schema);
		if (error) {
			return reject({
				message: error,
				statusCode: 400
			});
		}

		const newUser = new User({
			username,
			email,
			password
		});

		const result = await newUser.save();

		resolve(resultItemConverter(result));
	}
	catch (err) {
		reject(err);
	}
});