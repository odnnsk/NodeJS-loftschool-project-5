const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const mongoose = require('mongoose');
// require('../db/models/user');
const User = mongoose.model('user');
const secret = require('./config.json').secret;

const cookieExtractor = function(req) {
	var token = null;
	if (req && req.cookies) token = req.cookies['access_token'];
	return token;
};


const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
	secretOrKey: secret,
	// jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	jwtFromRequest: cookieExtractor,
};


// passport.serializeUser(function(user, done) {
// 	console.log('Serialize: ', user);
// 	done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
// 	console.log('Deserialize: ', id);
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		done(null, id);
// 	} else {
// 		User.findById(id, (err, user) => {
// 			if (err) {
// 				return done(err);
// 			}
// 			done(null, user);
// 		});
// 	}
// });

passport.use(
	new LocalStrategy(
		{
			usernameField: 'username',
			// passReqToCallback: true,
		},
		function(username, password, done) {
			User.findOne({ username })
				.then(user => {
					if (!user) {
						return done(null, false, 'User not found');
					}
					if (!user.validPassword(password)) {
						return done(null, false, 'Incorrect password!');
					}
					return done(null, user);
				})
				.catch(err => done(err));
		}
	)
);


passport.use(
	new Strategy(params, function(payload, done) {
		console.log(payload);
		User.findById(payload.id)
			.then(user => {
				if (!user) {
					return done(new Error('User not found'));
				}
				
				return done(null, user);
			})
			.catch(err => done(err));
	})
);