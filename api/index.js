const express = require('express');
const router = express.Router();
const passport = require('passport');
// const auth = passport.authenticate('jwt', { session: false });

const usersCtrl = require('../controllers/users');
const newsCtrl = require('../controllers/news');


const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(403).json({
		statusMessage: 'No access',
		data: { status: 403, message: 'No access' },
	});
};


// User
router.post('/authFromToken', usersCtrl.token);

router.post('/saveNewUser', isAuthenticated, usersCtrl.registration);

router.post('/login', usersCtrl.login);

router.get('/getUsers', usersCtrl.getUsers);

router.put('/updateUser/:id', isAuthenticated, usersCtrl.updateUser);

router.put('/updateUserPermission/:id', isAuthenticated, usersCtrl.updateUserPermission);

router.post('/saveUserImage/:id', isAuthenticated, usersCtrl.saveUserImage);

router.delete('/deleteUser/:id', isAuthenticated, usersCtrl.delUserById);


// News
router.post('/newNews', isAuthenticated, newsCtrl.newNews);

router.get('/getNews', newsCtrl.getNews);

router.put('/updateNews/:id', isAuthenticated, newsCtrl.updateNews);

router.delete('/deleteNews/:id', isAuthenticated, newsCtrl.deleteNews);


module.exports = router;