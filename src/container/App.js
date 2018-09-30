import React, { Component, PropTypes } from 'react';
import ChatRoom from '../components/ChatRoom';
import './loginbox.scss';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            uid:'',
            socket: io()
        }
    }

    generateUid() {
        return new Date().getTime()+""+Math.floor(Math.random()*9+1);
    }

    handleChange(e) {
        this.setState({username: e.target.value})
    }

    handleClick(e) {
        e.preventDefault();
        this.handleLogin();
    }
    handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleLogin()
        }
        return false;
    }

    handleLogin() {
        let username = this.state.username;

        const uid = this.generateUid();
        if (!username) {
            username = 'visitor'+ uid;
        }
        this.setState({uid:uid, username:username});
        this.state.socket.emit('login', {uid:uid, username:username})
    }
    render() {
        let renderDOM;
        if (this.state.uid) {
            renderDOM = <ChatRoom uid={this.state.uid} username={this.state.username} socket={this.state.socket}/>
        } else {
            renderDOM = (
                        <div className="login-box">
                            <h2>Welcom to ChatRoom</h2>
                            <div className="input">
                                <input type="text" placeholder="Please Enter Username" onChange={this.handleChange.bind(this)}
                                onKeyPress={this.handleKeyPress.bind(this)}/>
                                 <button type="button" onClick={this.handleClick.bind(this)} >Submit</button>
                            </div>
                        </div>
                        )
        }
        return (<div>{renderDOM}</div>)
    }
}