import React, { Component, Fragment } from 'react'
import SendBtn from '../../SendBtn';
import MessageInput from '../../MessageInput';
import Message from './Message';
import './style.css';
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
        const { 
            receiver: {userName: receiverName}, 
            messages, 
            userID, 
            back 
        } = this.props;
        return (
            <div className="msg-view-container">
                <div className="msg-view-header">
                    <span 
                    id="back-btn"
                    onClick={back}>
                        Back
                    </span>
                    <h5 id="msg-receiver">
                        {receiverName}
                    </h5>
                </div>
                <div className="msg-view-body">
                    {messages ? messages.map((msg, i) => (
                        <Message
                            key={i} 
                            message={msg.message}
                            isOwner={msg.sender._id === userID}
                        />
                    )) 
                    : 
                    <Fragment>
                    <div id="none">
                        <p>No messages yet :0</p>
                    </div>
                    </Fragment>}
                </div>
                <div className="msg-view-footer">
                    <MessageInput
                    customClass={"flex-input-msg"}
                    placeholder={"Your message"}
                    name={"message"}
                    />
                    <SendBtn
                    customClass={"flex-input-btn"}
                    text={"Send"}
                    />
                </div>
            </div>
        )
    }
}
