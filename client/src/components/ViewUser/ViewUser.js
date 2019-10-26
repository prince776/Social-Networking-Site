import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ProfileNavbar from './../Profile/ProfileNavbar.js'

import './ViewUser.css'

class ViewUser extends Component {

    state = {
        isLoading: true,
        username: '',
        signUpDate: '',
        // email: localStorage.getItem('targetEmail') ? localStorage.getItem('targetEmail') : '-1',
        email: '',
        userID: '',
        token: localStorage.getItem('signInToken') ? localStorage.getItem('signInToken') : '',
        message: '',
        redirect: '',
        profileImg: '',
        address: '',
        workplace: '',
        work: '',
        isVerified: false,
    }

    componentDidMount() {
        console.log('view user.js');
        this.setState({
            isLoading: true,
            userID: this.props.match.params.userID
        })
    }

    onAddFriendButtonPressed = () => {

        const { userID, token } = this.state;

        fetch('http://localhost:8080/api/account/addFriend'
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    targetUserID: userID,
                    token: token
                })
            }).then((res) => res.json()).then((json) => {
                this.setState({
                    message: json.message,
                })
            });

    }

    render() {

        const { token, userID, redirect, isLoading, username, email, isVerified, address, message, signUpDate, workplace, work, profileImg } = this.state;

        if (userID && isLoading) {

            fetch('http://localhost:8080/api/viewUser'
                , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: userID,
                        token: token
                    })
                }).then((res) => res.json()).then((json) => {

                    if (json.success) {
                        this.setState({
                            username: json.username,
                            email: json.email,
                            signUpDate: json.signUpDate,
                            address: json.address,
                            isVerified: json.isVerified,
                            message: json.message,
                            workplace: json.workplace,
                            work: json.work,
                            profileImg: json.profileImg,
                            isLoading: false,
                            token: json.token,
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            message: json.message,
                            token: json.token
                            // redirect: '/'
                        });
                    }
                });
        }

        if (isLoading) {
            return <p>Loading in ViewUser....</p>
        }

        if (redirect) {
            return <Redirect to={redirect}></Redirect>
        }
        var addFriendButton = <button onClick={this.onAddFriendButtonPressed}>Add Friend</button>;


        return (
            <div>
                <ProfileNavbar />
                <h3>Viewing Profile of {username}</h3>
                <br />
                {token ? addFriendButton : ''}
                <img src={profileImg} className='profileImg' />
                <h4>Name: {username}</h4>
                <h4>Email: {email}  Verified: {isVerified ? "YES" : "NO"}</h4>
                <h4>SignUp Date: {signUpDate}</h4>

                <h4>Adress: {address}</h4>
                <h4>Work: {work}</h4>
                <h4>Workplace: {workplace}</h4>
                <br />
                <hr />
                <br />
                <p>{message ? "Message: " + message : ""}</p>
            </div >
        )

    }

}

export default ViewUser;