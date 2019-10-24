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
        email: '1',
        token: localStorage.getItem('signInToken') ? localStorage.getItem('signInToken') : '-1',
        message: '',
        redirect: '',
        profileImg: '',
        address: '',
        workplace: '',
        work: '',
        isVerified: false,
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        })
    }

    render() {

        const { token, redirect, isLoading, username, email, isVerified, address, message, signUpDate, workplace, work, profileImg } = this.state;

        if (token && email && isLoading) {

            fetch('http://localhost:8080/api/viewProfile'
                , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email
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
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            redirect: '/'
                        });
                    }
                });
        }

        if (isLoading) {
            return <p>Loading....</p>
        }

        if (redirect) {
            return <Redirect to={redirect}></Redirect>
        }

        return (
            <div>
                <ProfileNavbar />
                <h3>Viewing Profile of {username}</h3>
                <br />
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