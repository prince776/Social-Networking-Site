const mongoose = require('mongoose');

const UserSession = new mongoose.Schema({
	userID:{
		type:String,
		default:-1
	},
	timestamp:{
		type:Date,
		default:Date.now()
	},
	isDeleted:{
		type:Boolean,
		default:false
	}
});

module.exports = mongoose.model("UserSession",UserSession);