const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');

/* GET users listing. */
// router.post('/saveNewUser', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/saveNewUser', async (req, res) => {
	try {
		// const result = await usersCtrl.add({ ...req.body });
		// res.json({
		// 	data: result
		// });

		res.send('test response');
	}
	catch (err) {
		console.error("err", err);
		// res.status(400).json({
		// 	message: err
		// });
	}
});

module.exports = router;
