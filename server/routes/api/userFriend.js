var User = require('../../models/user.js');
var UserSession = require('../../models/userSession.js');

var sendError = (res, error) => {
    return res.send({
        success: false,
        message: 'Error: ' + error + "!"
    })
}

module.exports = (app) => {

    app.post('/api/account/friends', (req, res) => {
        const { body } = req;
        const { token } = body;

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, previousSessions) => {
            if (err) {
                return sendError(res, "Server Error");
            } else if (previousSessions.length < 1) {
                return sendError(res, "Invalid Session");
            } else {

                var userID = previousSessions[0].userID;

                User.find({
                    _id: userID,
                    isDeleted: false
                }, (err, previousUsers) => {
                    if (err) {
                        return sendError(res, "Server Error");
                    } else if (previousUsers.length < 1) {
                        return sendError(res, "Invalid User")
                    } else {

                        var friendList = previousUsers[0].friendList;
                        var friendRequestsSent = previousUsers[0].friendRequestsSent;
                        var friendRequestsReceived = previousUsers[0].friendRequestsReceived;

                        return res.send({
                            success: true,
                            friendList: friendList,
                            friendRequestsReceived: friendRequestsReceived,
                            friendRequestsSent: friendRequestsSent
                        })

                    }
                });

            }
        });

    });

    app.post('/api/account/addFriend', (req, res) => {
        var { body } = req;
        var { targetUserID, token } = body;

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, previousSessions) => {
            if (err) {
                return sendError(res, "Server Error");
            } else if (previousSessions.length < 1) {
                return sendError(res, "Invalid Session");
            } else {

                var currentUserID = previousSessions[0].userID;

                User.find({
                    _id: currentUserID,
                    isDeleted: false
                }, (err, previousUsers) => {
                    if (err) {
                        return sendError(res, "Server Error");
                    } else if (previousUsers.length < 1) {
                        return sendError(res, "User Not Found");
                    } else {

                        var currentUser = previousUsers[0];

                        User.find({
                            _id: targetUserID,
                            isDeleted: false
                        }, (errT, previousUsersT) => {
                            if (errT) {
                                return sendError(res, "Server Error");
                            } else if (previousUsersT.length < 1) {
                                return sendError(res, "User Not Found");
                            } else {

                                var targetUser = previousUsersT[0];

                                targetUser.friendRequestsReceived.push({
                                    userID: currentUser.userID,
                                    username: currentUser.username,
                                });

                                currentUser.friendRequestsSent.push({
                                    userID: targetUser.userID,
                                    username: targetUser.username,
                                });

                                targetUser.save((err, doc) => {
                                    if (err) {
                                        return sendError(res, "Server Error");
                                    }
                                });

                                currentUser.save((err, doc) => {
                                    if (err) {
                                        return sendError(res, "Server Error");
                                    }
                                });

                                return res.send({
                                    success: true,
                                    message: 'Friend Request Sent'
                                });

                            }
                        })
                    }
                })
            }
        })


    })

}
