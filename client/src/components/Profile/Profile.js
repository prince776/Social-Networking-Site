import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import ProfileEdit from './ProfileEdit.js'
import ProfileNavbar from './ProfileNavbar.js'

import './Profile.css'
import Friends from './Friends/Friends.js'

class Profile extends Component {
	state = {
		isLoading: true,
		userName: '',
		userSignUpDate: '',
		userEmail: '',
		token: (localStorage.getItem('signInToken') ? localStorage.getItem('signInToken') : '-1'),
		message: '',
		redirect: '',
		editProfile: false,
		profileImg: '',
		address: '',
		workplace: '',
		work: '',
		isVerified: false,
		verificationCode: '',
		verificationMessage: ''
	};

	componentDidMount() {
		this.setState({
			isLoading: true,
		});
	}

	onEditProfile = () => {
		this.setState({
			editProfile: true
		})
	}

	onSignOut = () => {
		const { token } = this.state;

		this.setState({
			isLoading: true
		});

		fetch("http://localhost:8080/api/account/signout"
			, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					token: token
				})
			}).then((res) => res.json()).then((json) => {

				if (json.success) {
					localStorage.removeItem('signInToken');
				}
				this.setState({
					isLoading: false,
					redirect: '/'
				});
			});

	}

	reqVerificationCode = () => {
		const { userEmail } = this.state;

		if (!userEmail) return;

		fetch('http://localhost:8080/api/account/profile/reqVerificationCode'
			, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					email: userEmail
				})
			}).then((res) => res.json()).then((json) => {
				this.setState({
					verificationMessage: json.message
				});

			})
	}

	onVerificationInputBoxChange = (e) => {
		this.setState({
			verificationCode: e.target.value
		})
	}

	verifyEmail = () => {
		const { verificationCode, userEmail } = this.state;
		if (!verificationCode) {
			this.setState({
				verificationMessage: 'Please enter the verification code first'
			})
			return
		}

		fetch('http://localhost:8080/api/account/profile/verifyEmail'
			, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					code: verificationCode,
					email: userEmail
				})
			}).then((res) => res.json()).then((json) => {
				this.setState({
					verificationMessage: json.message
				})
			})

	}

	render() {

		const { verificationMessage, isVerified, address, workplace, work, profileImg, editProfile, redirect, token, isLoading, message, userName, userEmail, userSignUpDate } = this.state;

		if (!userName && token) { //if there is no user and token is succesfully loaded from local storage
			fetch('http://localhost:8080/api/account/profile'
				, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify({
						token: token,
					})
				}).then((res) => res.json()).then((json) => {

					if (json.success) {
						this.setState({
							userName: json.userName,
							userSignUpDate: json.userSignUpDate,
							userEmail: json.userEmail,
							isLoading: false,
							message: json.message,
							profileImg: json.profileImg,
							address: json.address,
							work: json.work,
							workplace: json.workplace,
							isVerified: json.isVerified
						});
					} else {//redirect becoz no session
						this.setState({
							isLoading: false,
							redirect: '/'
						});
					}

				});
		}

		if (redirect) {
			return <Redirect to={redirect} />;
		}

		if (isLoading) {
			return (<div><p>Loading......</p></div>);
		}

		var reqVerificationCodeButton;
		var verificationCodeInput;
		var verifyEmailButton;

		if (!isVerified) {
			reqVerificationCodeButton = <button onClick={this.reqVerificationCode} > Send Verification Code</button>;
			verificationCodeInput = <input type='text' onChange={this.onVerificationInputBoxChange} placeholder='Enter the verfication code you received' />
			verifyEmailButton = <button onClick={this.verifyEmail}>Verify Email</button>
		}

		return (
			<div>
				<ProfileNavbar />
				<h3>Profile Page</h3>
				<br />
				<img src={profileImg} className='profileImg' />
				<h4>Name: {userName}</h4>
				<h4>Email: {userEmail}  Verified: {isVerified ? "YES" : "NO"}</h4>
				<h4>SignUp Date: {userSignUpDate}</h4>

				<h4>Adress: {address}</h4>
				<h4>Work: {work}</h4>
				<h4>Workplace: {workplace}</h4>
				<br />
				<hr />
				<br />

				<button onClick={this.onSignOut}>Log Out</button><br /><br />
				<button onClick={this.onEditProfile} > Edit Profile</button>
				<br />
				{reqVerificationCodeButton}<br />
				{verificationCodeInput}<br />
				{verifyEmailButton}<br />
				{verificationMessage} <br />


				<ProfileEdit shouldEditProfile={editProfile} signInToken={token} />
				<p>{message ? "Message: " + message : ""}</p>
			</div>

		);
	}

}

export default Profile