var User = require('../../models/user.js');
var UserSession = require('../../models/userSession.js');

var sendError = (res, error) => {
    return res.send({
        success: false,
        message: 'Error: ' + error + "!"
    })
}

module.exports = (app) => {

    app.post('/api/viewProfile', (req, res) => {
        var { body } = req;
        var { email } = body;
        console.log(email);
        // email = email.trim();

        if (!email) {
            return sendError(res, "Provide Email");
        }

        User.find({
            email: email,
            isDeleted: false
        }, (err, previousUsers) => {
            if (err) {
                return sendError(res, "Server Error");
            } else if (previousUsers.length < 1) {
                return sendError(res, "Email not found");
            } else {

                var user = previousUsers[0];

                return res.send({
                    success: true,
                    username: user.username,
                    email: user.email,
                    signUpDate: user.signUpDate,
                    profileImg: user.profileImg,
                    address: user.address,
                    workplace: user.workplace,
                    work: user.work,
                    isVerified: user.isVerified,
                    message: "Succesfully fetched User data"
                });

            }
        })

    })

}


