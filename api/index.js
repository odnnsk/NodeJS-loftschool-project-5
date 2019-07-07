const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersCtrl = require('../controllers/users');
const newsCtrl = require('../controllers/news');

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

// User
router.post('/authFromToken', usersCtrl.token);

router.post('/saveNewUser', usersCtrl.registration);

router.post('/login', usersCtrl.login);

router.get('/getUsers', usersCtrl.getUsers);

router.put('/updateUser/:id', usersCtrl.updateUser);

router.put('/updateUserPermission/:id', usersCtrl.updateUserPermission);

router.post('/saveUserImage/:id', usersCtrl.saveUserImage);

router.delete('/deleteUser/:id', usersCtrl.delUserById);



// News
router.post('/newNews', newsCtrl.newNews);

router.get('/getNews', newsCtrl.getNews);

router.put('/updateNews/:id', newsCtrl.updateNews);

router.delete('/deleteNews/:id', newsCtrl.deleteNews);




// router.post('/saveNewUser', (req, res) => {
//
// 	let data = JSON.parse(req.body);
//
// 	console.log(typeof data);
// 	console.log(data);
// });

module.exports = router;