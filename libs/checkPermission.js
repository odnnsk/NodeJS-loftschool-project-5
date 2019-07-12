const checkPermission = (item, action, userPermission, done) => {
	if(userPermission[item][action]) return done(true);
	return done(false);
};

module.exports = checkPermission;