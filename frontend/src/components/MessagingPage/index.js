import React, { Component, Fragment } from 'react'
import socketIOClient from 'socket.io-client';
import { setSocket, 
    setOnline, 
    updateChat, 
    setChat 
} from '../../actions/conversationActions';
import { connect } from 'react-redux';
import UserElement from './UserElement';
import './style.css'
import MessageView from './MessageView';
class MessagingPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            userList: [],
            displayChat: false,
        }
    }

    componentDidMount(){
        let { socket } = this.props.conversations;
        const { user } = this.props;
        const endPoint = 'http://127.0.0.1:8080';
        if(!socket){
            socket = socketIOClient(endPoint, {
                path: '/socket',
            });
            socket.emit('subscribe', {
                room: 'public-room', 
                user: user,
            });
            this.props.setSocket(socket);
        };
        socket.on('public_join', data => {
            const sanitizedList = data.list.filter(({_id}) => _id !== user._id);
            this.props.setOnline(sanitizedList);
        });
    }

    openChat = ids => {
        let { socket } = this.props.conversations;
        socket.emit('join_private', {
            ids,
        });
        socket.on('existing_data', data => {
            this.props.setChat(data);
        });
        this.toggleChat();
    }

    toggleChat = () => {
        this.setState(prevState => ({
            displayChat: !prevState.displayChat,
        }));
    }

    update = data => {
        console.log(data);
    }

    render() {
        const { online, socket, receiver, selected: {messages} } = this.props.conversations;
        const { _id } = this.props.user;
        const { displayChat } = this.state;
        return (
            <div id="conversation-container">
                    {
                    displayChat ?
                    <Fragment>
                        <MessageView 
                            socket={socket}
                            updateConversation={this.update}
                            back={this.toggleChat}
                            messages={messages}
                            receiver={receiver}
                        />
                    </Fragment>
                    :
                    <Fragment>
                        <h1>Currently online</h1>
                        {online.length ? 
                        online.map((elem, i) => (
                            <UserElement 
                                key={i}
                                name={elem.userName}
                                handleClick={() => this.openChat(
                                    elem._id + '_' + _id
                                )}
                            />
                        ))
                        :
                        <div id="list-empty">
                            <h5>Nobody seems to be online :/</h5>    
                        </div>}
                    </Fragment>
                    }
            </div>
        )
    }
}

const propMap = state => ({
    conversations: state.conversations,
    user: state.auth.user
})

export default connect(propMap, {
    setSocket, 
    setOnline, 
    updateChat, 
    setChat
})(MessagingPage);