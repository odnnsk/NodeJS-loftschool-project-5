const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
	userId: {
		type: String,
		required: [true, 'userId required'],
		unique: true,
	},
	date: {
		type: String,
		required: [true, 'date required'],
	},
	theme: {
		type: String,
		required: [true, 'theme required'],
	},
	text: {
		type: String,
		required: [true, 'text required'],
	},
});


mongoose.model('news', newsSchema);
