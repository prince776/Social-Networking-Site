import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import './Friends.css'
import ProfileNavbar from './../ProfileNavbar.js'

//Class to check some functionalities of react js
class Friends extends Component {

    state = {
        token: localStorage.getItem('signInToken'),
        friendList: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        redirect: '',
        isLoading: '',
        message: ''
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        });
    }

    render() {
        const { friendList, token, isLoading, friendRequestsReceived, friendRequestsSent } = this.state;

        if (token) {
            fetch('http://localhost:8080/api/account/friends'
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
                    this.setState({
                        friendList: json.friendList,
                        friendRequestsReceived: json.friendRequestsReceived,
                        friendRequestsSent: json.friendRequestsSent,
                        message: json.message,
                        isLoading: false
                    })
                });
        }

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <ProfileNavbar />
                <br />

                <Fragment>
                    <h3>Your Friends</h3>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Since</th>
                        </tr>
                    </thead>

                    <tbody>

                        {friendList.map(friend => (
                            <tr key={friend.username}>
                                <td>{friend.username}</td>
                                <td>{friend.since}</td>
                            </tr>
                        ))}

                    </tbody>

                </Fragment>
                <br />
                <Fragment>
                    <h3>Friend Requests For You</h3>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Since</th>
                        </tr>
                    </thead>

                    <tbody>

                        {friendRequestsReceived.map(friend => (
                            <tr key={friend.username}>
                                <td>{friend.username}</td>
                                <td>{friend.since}</td>
                            </tr>
                        ))}

                    </tbody>

                </Fragment>
                <br />
                <Fragment>
                    <h3>Friend Requests You Sent</h3>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Since</th>
                        </tr>
                    </thead>

                    <tbody>

                        {friendRequestsSent.map(friend => (
                            <tr key={friend.username}>
                                <td>{friend.username}</td>
                                <td>{friend.since}</td>
                            </tr>
                        ))}

                    </tbody>

                </Fragment>

            </div>
        );
    }


}

export default Friends