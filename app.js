const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

require('./db');
require(path.join(__dirname, 'db', 'userAdmin'));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));

// parse text/plain
app.use(bodyParser.text());
// app.use((req, res, next) => {
// 	if(Object.keys(req.body).length) req.body = JSON.parse(req.body);
// 	next();
// });

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

app.use(cookieParser());

//Session
app.use(
	session({
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		secret: 'key-secret',
		key: 'session-key',
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: 30 * 60 * 1000,
		},
		saveUninitialized: false,
		resave: true,
		ephemeral: true,
		rolling: true,
	})
);


// app.get('/', (req, res, next) => {
// 	res.json({"permission":{"chat":{"C":false,"R":true,"U":true,"D":false},"news":{"C":false,"R":true,"U":false,"D":false},"setting":{"C":false,"R":false,"U":false,"D":false}},"_id":"5d20a242a9fab53dac194370","username":"admin","surName":"a","firstName":"a","middleName":"a","image":"","access_token":"ff68f300-8e93-4c86-83be-974dd1a2e86d","permissionId":"2","password":"$2a$10$jbX2RB9fyVqRt66QgkTCZ.K6aGqhYmGLYrXiok2BFkolh7nRjnAZa","__v":0});
// })

app.use(express.static(path.join(__dirname, 'public')));

//Passport
require('./config/config-passport');
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api', require(path.join(__dirname, 'api')));
app.use(require(path.join(__dirname, 'routes')));







// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


app.use((req, res, next) => {
	res.status(404).json({ err: '404', message: 'Not found' });
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).json({ err: '500', message: err.message });
});

module.exports = app;
