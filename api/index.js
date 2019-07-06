const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersCtrl = require('../controllers/users');

// router.post('/saveNewUser', async (req, res) => {
// 	try {
// 		// const result = await usersCtrl.add({ ...req.body });
// 		// res.json({
// 		// 	data: result
// 		// });
//
// 		res.send('test response');
// 	}
// 	catch (err) {
// 		console.error("err", err);
// 		// res.status(400).json({
// 		// 	message: err
// 		// });
// 	}
// });

// router.get('/', (req, res, next) => {
// 	console.log('TEST');
// 	next();
// });


router.post('/authFromToken', usersCtrl.token);

router.post('/saveNewUser', usersCtrl.registration);

router.post('/login', usersCtrl.login);

// router.post('/saveNewUser', (req, res) => {
//
// 	let data = JSON.parse(req.body);
//
// 	console.log(typeof data);
// 	console.log(data);
// });

module.exports = router;