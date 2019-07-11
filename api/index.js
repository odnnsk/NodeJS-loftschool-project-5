const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const usersCtrl = require('../controllers/users');
const newsCtrl = require('../controllers/news');


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


module.exports = router;