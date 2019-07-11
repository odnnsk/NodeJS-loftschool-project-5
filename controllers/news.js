// const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const News = mongoose.model('news');
const makeJwtToken = require('../libs/makeJwtToken');


const resultUsersConverter = (item) => {
	return {
		id: item._id,
		username: item.username,
		surName: item.surName,
		firstName: item.firstName,
		middleName: item.middleName,
		image: item.image,
		access_token: makeJwtToken(item),
		password: item.password
	}
};


const getNewsList = async () => {
	let resultNews = [];
	let users = [];
	let convertUsers = [];
	let userIds = [];
	const news = await News.find();


	let findUserById = userId => {
		for(let i = 0; i < convertUsers.length; i++){
			if(String(convertUsers[i]['id']) === userId){
				return convertUsers[i];
			}
		}
	};

	let existsInArray = (id, source) => {
		if(!source.length) return false;

		for(let i = 0; i < source.length; i++){
			if(source[i] === id) return true;
		}
		
		return false;
	};

	news.forEach(el => {
		if(!existsInArray(el.userId, userIds)){
			userIds[userIds.length] = el.userId;
		}
	});


	users = await User.find().where('_id').in(userIds);

	convertUsers = users.map(resultUsersConverter);


	resultNews = news.map(item => {
		let result = {};
		result.id = item._id;
		result.date = item.date;
		result.text = item.text;
		result.theme = item.theme;
		result.user = findUserById(item.userId);

		return result;
	});


	return resultNews;
};



const errorHandler = (err, res) => {
	res.status(400).json({
		statusMessage: 'Error',
		data: { status: 400, message: err.message },
	});
};


module.exports.newNews = async (req, res, next) => {
	const data = JSON.parse(req.body);
	const { userId, theme, text, date } = data;

	const New = new News({
		data,
		userId,
		theme,
		text,
		date
	});

	await New.save();
	const result = await getNewsList();

	return res.json(result);
};

module.exports.getNews = async (req, res, next) => {
	const result = await getNewsList();

	return res.json(result);
};

module.exports.updateNews = async (req, res, next) => {
	const data = JSON.parse(req.body);
	const item = await News.findById(req.params.id);

	if(!data) return errorHandler('Error data', res);

	item.set(data);
	await item.save();
	const result = await getNewsList();

	return res.json(result);
};

module.exports.deleteNews = async (req, res, next) => {
	await News.findByIdAndRemove({ _id: req.params.id });

	const result = await getNewsList();

	return res.json(result);
};
