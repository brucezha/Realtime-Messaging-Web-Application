import React, {Component} from 'react';

export default class RoomStatus extends Component {
    render() {
        return(<div className="room-status"> {this.props.onlineCount} in this room: {this.props.userhtml}</div>)
    }
}