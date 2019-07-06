const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username required'],
		unique: true,
	},
	surName: {
		type: String,
		required: [true, 'surName required'],
		// unique: true,
	},
	firstName: {
		type: String,
		required: [true, 'firstName required'],
		// unique: true,
	},
	middleName: {
		type: String,
		required: [true, 'middleName required'],
		// unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password required'],
	},
	image: {
		type: String,
		// required: [true, 'Password required'],
	},
	permission: {
		chat: {
			C: {
				type: Boolean,
			},
			R: {
				type: Boolean,
			},
			U: {
				type: Boolean,
			},
			D: {
				type: Boolean,
			}
		},
		news: {
			C: {
				type: Boolean,
			},
			R: {
				type: Boolean,
			},
			U: {
				type: Boolean,
			},
			D: {
				type: Boolean,
			}
		},
		setting: {
			C: {
				type: Boolean,
			},
			R: {
				type: Boolean,
			},
			U: {
				type: Boolean,
			},
			D: {
				type: Boolean,
			}
		}
	},
	permissionId: {
		type: String,
	},
	access_token: {
		type: String,
	},
});

userSchema.methods.setPassword = function(password) {
	this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
	return bCrypt.compareSync(password, this.password);
};

userSchema.methods.setToken = function(access_token) {
	this.access_token = access_token;
};

mongoose.model('user', userSchema);
