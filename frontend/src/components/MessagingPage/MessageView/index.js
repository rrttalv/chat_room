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

    componentDidMount = () => {
        const { socket, updateConversation } = this.props;
        socket.on('new_message', data => {
            updateConversation(data);
        });
    }

    sendMessage = () => {
        const { roomID, socket, messageData, sender, receiver } = this.props;
        const { message } = this.state;
        const conversationID = messageData ? messageData._id : undefined;
        if(message.length){
            socket.emit('send_message', {
                roomID,
                message,
                sender,
                receiver: receiver._id,
                conversationID,
            });
            this.setState({
                message: '',
            });
        }
    }

    handleSubmit = e => {
        if(e.keyCode === 13 || e.type === 'click'){
            this.sendMessage()
        }
    }

    handleChange = e => {
        const { value, name } = e.target;
        this.setState({[name]: value});
    }

    render() {
        const { 
            receiver: {userName}, 
            messageData, 
            sender, 
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
                        {userName}
                    </h5>
                </div>
                <div className="msg-view-body">
                    {messageData 
                    && 
                    messageData.messages ? 
                    messageData.messages.map((msg, i) => (
                        <Message
                            key={i} 
                            message={msg.message}
                            isOwner={msg.sender === sender}
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
                        handleKeyup={this.handleSubmit}
                        handleChange={this.handleChange}
                        value={this.state.message}
                    />
                    <SendBtn
                        customClass={"flex-input-btn"}
                        text={"Send"}
                        handleClick={this.handleSubmit}
                    />
                </div>
            </div>
        )
    }
}
