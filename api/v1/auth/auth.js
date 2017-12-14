var jwt = require("jsonwebtoken"),
	expressjwt = require("express-jwt"), 
	userModel  = require("../user/user-model.js"),
	checkToken = expressjwt({secret: "jsonToken"});

exports.decodeToken = function(req, res, next) {
	checkToken(req, res, next);
}


exports.verifyUser = function(req, res, next) {
	var username = req.body.username,
		password = req.body.password;

	if(!username || !password) {
		return next(new Error("please enter your username"))
	} 

	userModel.findOne({username: username}, function(err, data) {
		if(err) {
			return next(new Error("cannot find user"))
		}

		if(!data.authenticate(password)) {
			return next(new Error("Invalid username and password"))
		}

		req.user = data;
		next();
	})
}

exports.signToken = function(id) {
	return jwt.sign(
		{_id: id},
		"jsonToken",
		{expiresIn: 60 * 60 * 24 * 7}
	);
}