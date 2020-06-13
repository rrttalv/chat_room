import React, { Component } from 'react'

export default class MessageView extends Component {

    constructor(props){
        super(props);
        this.state = {
            message: '',
            messages: [],
        }
    }

    sendMessage = () => {
        const { roomID, socket, updateConversation } = this.props;
        const { message } = this.state;
        socket.emit('send_message', {
            roomID,
            message,
        });
        socket.on('new_message', data => {
            updateConversation(data);
        });
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}
