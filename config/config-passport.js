const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.serializeUser(function(user, done) {
	console.log('Serialize: ', user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('Deserialize: ', id);
	if (!mongoose.Types.ObjectId.isValid(id)) {
		done(null, id);
	} else {
		User.findById(id, (err, user) => {
			if (err) {
				return done(err);
			}
			done(null, user);
		});
	}
});

passport.use(
	new LocalStrategy(
		{
			// usernameField: 'email',
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
						return done(null, false, 'Incorrect password');
					}
					return done(null, user);
				})
				.catch(err => done(err));
		}
	)
);

// passport.use(
// 	new GithubStrategy(
// 		{
// 			clientID: config.github.clientID,
// 			clientSecret: config.github.clientSecret,
// 			callbackURL: config.github.callbackURL,
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			console.log('profile: ' + JSON.stringify(profile.displayName));
// 			// TODO: Create user in MongoDB
// 			return done(null, profile);
// 		}
// 	)
// );
