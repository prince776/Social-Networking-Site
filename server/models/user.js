const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var Friend = mongoose.Schema({
	userID: {
		type: String
	},
	username: {
		type: String,
	},
	since: {
		type: Date,
		default: Date.now()
	}
});

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		default: ''
	},
	password: {
		type: String,
		default: ''
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	signUpDate: {
		type: Date,
		default: Date.now()
	},
	username: {
		type: String,
		default: ''
	},
	profileImg: {
		type: String,
		default: ''
	},
	address: {
		type: String,
		default: ''
	},
	work: {
		type: String,
		default: ''
	},
	workplace: {
		type: String,
		default: ''
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	friendList: [{
		type: Friend
	}],
	friendRequestsReceived: [{
		type: Friend
	}],
	friendRequestsSent: [{
		type: Friend
	}]
});

//methods
UserSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
}

//export as a mongoose.model using Schema
module.exports = mongoose.model("User", UserSchema);
