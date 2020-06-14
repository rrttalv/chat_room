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
            displayChat: false,
            chatLoading: false,
        }
        this.refreshInterval = null;
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
        socket.emit('get_unseen', {
            userID: user._id,
        });
        this.setUnseenRefresh(socket, user._id);
        socket.on('seen_info', data => {
            const onlineUsers = this.props.conversations.online;
            if(!onlineUsers){
                return;
            }
            const idList = data.map(elem => elem.receiver);
            const unseenAttached = onlineUsers.map(user => {
                const idx = idList.indexOf(user._id);
                if(idx !== -1){
                    user.unseenMessageCount = data[idx].unseen;
                };
                return user;
            });
            this.props.setOnline(unseenAttached);
        })
    };

    /*
        Get unseen conversations every 60 seconds
        In production this number would be higher
    */
    setUnseenRefresh = (socket, userID) => {
        this.refreshInterval = setInterval(() => {
            socket.emit('get_unseen', {
                userID,
            });
        }, 60000)
    }

    openChat = (receiver, sender) => {
        this.setState({chatLoading: true});
        let { socket } = this.props.conversations;
        socket.emit('join_private', {
            receiver,
            sender,
        });
        socket.on('existing_data', data => {
            this.props.setChat(data);
            this.setState({chatLoading: false});
        });
        this.toggleChat();
    };

    toggleChat = (back=false) => {
        if(back){
            this.props.setChat({selected:{}})
        }
        this.setState(prevState => ({
            displayChat: !prevState.displayChat,
        }));
    };

    update = newMessage => {
        let { selected: { data } } = this.props.conversations;
        /**
         * If there is an existing conversation then we just add a new message into
         * the existing state data object
         * 
         * If there is no existing conversation, then the newMessage object will be a completely
         * new conversation Object sent from the server
         */
        if(data){
            data.messages.push(newMessage);    
        }else{
            data = newMessage;
        }
        this.props.updateChat(data);
    }

    render() {
        const { online, socket, participants, selected: {data, roomID} } = this.props.conversations;
        const { _id } = this.props.user;
        const { displayChat, chatLoading } = this.state;
        return (
            <div id="conversation-container">
                    {
                    displayChat && participants.length ?
                    <Fragment>
                        <MessageView 
                            socket={socket}
                            updateConversation={this.update}
                            back={() => this.toggleChat(true)}
                            messageData={data}
                            roomID={roomID}
                            sender={_id}
                            receiver={participants.find(({_id: partID}) => partID !== _id)}
                            loading={chatLoading}
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
                                    elem._id, _id
                                )}
                                unread={elem.unseenMessageCount}
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