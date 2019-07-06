const express = require('express');
const router = express.Router();

// router.use(function (req, res, next) {
// 	const data = 'data test';
// 	console.log('%s %s %s', req.method, req.url, req.path);
// 	next(data)
// })

// router.all('/', usersCtrl.token);

/* GET home page. */
router.get('*', (req, res, next) => {
	res.redirect('/');
});


module.exports = router;
