import React, { Component } from 'react'
import SendBtn from '../../SendBtn';
import MessageInput from '../../MessageInput';

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
        const { receiverName, messages, userID } = this.props;
        return (
            <div className="msg-view-container">
                <div className="msg-view-header">
                    <span id="back-btn">
                        Back
                    </span>
                    <h5 id="msg-receiver">
                        {receiverName}
                    </h5>
                </div>
                <div className="msg-view-body">
                    {messages.map((msg, i) => (
                        <Message
                            key={i} 
                            message={msg.message}
                            isOwner={msg.sender._id === userID}
                        />
                    ))}
                </div>
                <div className="msg-view-footer">
                    <MessageInput />
                    <SendBtn />
                </div>
            </div>
        )
    }
}
