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
            this.scrollOnAction();
        });
    };

    componentDidUpdate = prev => {
        if(prev.loading !== this.props.loading){
            this.scrollOnAction();
        }
    }

    goBack = () => {
        const { back, socket, roomID, sender } = this.props;
        socket.emit('leave_room', {
            roomID,
        });
        socket.emit('get_unseen', {
            userID: sender,
        })
        socket.off('new_message');
        back();
    };

    scrollOnAction = () => {
        const msgBody = document.querySelector('.msg-view-body');
        if(msgBody){
            const { offsetHeight, scrollHeight } = msgBody;
            if(scrollHeight > offsetHeight){
                msgBody.scroll(0, scrollHeight);
            };
        };
    };

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
            this.scrollOnAction();
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
            loading,
        } = this.props;
        return (
            <Fragment>
                {loading ? 
                    <span>loading...</span>
                    :
                    <div className="msg-view-container">
                        <div className="msg-view-header">
                            <span 
                            id="back-btn"
                            onClick={this.goBack}>
                                Back
                            </span>
                            <h5 id="msg-receiver">
                                {userName}
                            </h5>
                        </div>
                        <div className="msg-view-body">
                            {messageData 
                            && 
                            messageData.messages.length ? 
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
                }
        </Fragment>
        )
    }
}
