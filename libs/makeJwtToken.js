const jwt = require('jsonwebtoken');
const secret = require('../config/config.json').secret;

const makeJwtToken = item => {
	const payload = {
		id: item._id,
	};

	return jwt.sign(payload, secret);
};

module.exports = makeJwtToken;