import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        const socket = this.props.socket;
        this.state = {
            myId: this.props.uid,
            myName: this.props.username,
            uid: this.props.uid,
            username: this.props.username,
            socket: socket,
            messages:[],
            onlineUsers: {},
            onlineCount: 0,
            userhtml:'',
        }
        this.ready();
    }

    handleUsers() {
        const users = this.state.onlineUsers;
        let userhtml = '';
        let separator = '';
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userhtml+= separator + users[key];
                separator = '、';
            }
        }
        this.setState({userhtml: userhtml})
    }

    generateMsgId() {
        return new Date().getTime()+""+Math.floor(Math.random()*899+100);
    }

    updateSysMsg(o, action) {
        let messages = this.state.messages;
        const newMsg = {type:'system', username:o.user.username, uid:o.user.uid, action:action, msgId: this.generateMsgId(), time:this.generateTime()}
        messages = messages.concat(newMsg)
        this.setState({
            onlineCount: o.onlineCount,
            onlineUsers: o.onlineUsers,
            messages: messages
        });
        this.handleUsers();
    }

    updateMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {type:'chat', username:obj.username, uid:obj.uid, action:obj.message, msgId:this.generateMsgId(), time:this.generateTime()};
        messages = messages.concat(newMsg);
        this.setState({messages:messages})
    }

    generateTime() {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour==0) ? '00' : hour;
        minute = (minute<10) ? '0' + minute : minute;
        return hour + ':' + minute;
    }

    handleLogout() {
        location.reload();
    }

    ready() {
        const socket = this.state.socket;
        socket.on('login', (o)=>{
            this.updateSysMsg(o, 'login');
        })
        socket.on('logout', (o)=>{
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj)=>{
            this.updateMsg(obj)
        })
    }

    render() {
        return(
            <div className="chat-room">
                <div className="welcome">
                    <div className="room-name"> {this.state.myName}</div>
                    <div className="button">
                        <button onClick={this.handleLogout}>Sign Out</button>
                    </div>
                </div>
                <RoomStatus onlineCount={this.state.onlineCount} userhtml={this.state.userhtml}/>
                <div ref="chatArea">
                    <Messages messages={this.state.messages} myId={this.state.myId} />
                    <ChatInput myId={this.state.myId} myName={this.state.myName} socket={this.state.socket}/>
                </div>
            </div>)
    }
}