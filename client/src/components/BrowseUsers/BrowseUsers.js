import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom'
import './BrowseUsers.css'

class BrowseUsers extends Component {
    state = {
        isLoading: false,
        users: [],
        message: '',
        token: localStorage.getItem('signInToken'),
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
    }

    render() {

        const { isLoading, message, users, token } = this.state;

        if (isLoading) {

            fetch('http://localhost:8080/api/allUsers'
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
                    console.log(json.users);
                    this.setState({
                        users: json.users,
                        isLoading: false,
                        message: json.message
                    })
                });

        }

        if (isLoading) {
            return <p>Loading... </p>
        }

        return (
            <div>
                <h1>Browse Users</h1>

                <Fragment>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td><Link to={`/viewUser/${user._id}`}>{user.username}</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </Fragment>

                <p>{message ? `Message: ${message}` : ""}</p>

            </div>
        );
    }

}

export default BrowseUsers;