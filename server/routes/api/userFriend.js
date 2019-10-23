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

}
