var mongoose = require("mongoose"),
	bcrypt	 = require("bcrypt"),
	UserSchema;

mongoose.connect("mongodb://localhost/student")

UserSchema = new mongoose.Schema({
	username: {type: String, required:true, unique:true},
	password: {type: String, required:true}
})

UserSchema.pre("save", function(next) {
	this.password = this.encryptPassword(this.password);
	next()
})

UserSchema.methods = {
	encryptPassword: function(plainText) { //plaintext refers to the passwords
		if(!plainText) {
			return "";
		}   			

		var salt = bcrypt.genSaltSync()
		return bcrypt.hashSync(plainText, salt);
	},
	authenticate: function(plainText) {
		return bcrypt.compareSync(plainText, this.password)
	}
}

module.exports = mongoose.model("user", UserSchema);