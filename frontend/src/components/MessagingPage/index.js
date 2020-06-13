import React, { Component } from 'react'
import socketIOClient from 'socket.io-client';
import { setSocket, setOnline } from '../../actions/conversationActions';
import { connect } from 'react-redux';
import UserElement from './UserElement';

class MessagingPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            userList: [],
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
        };
        socket.on('public_join', data => {
            const sanitizedList = data.list.filter(({_id}) => _id !== user._id);
            console.log(data)
            this.props.setOnline(sanitizedList);
        });
    }

    startChat = id => {
        console.log(id);
    }

    render() {
        const { online } = this.props.conversations;
        return (
            <div id="list-container">
                <h1>Currently online</h1>
                {online.length ? 
                online.map((elem, i) => (
                    <UserElement 
                        key={i}
                        name={elem.userName}
                        handleClick={() => this.startChat(elem.id)}
                    />
                ))
                :
                <div>
                    <h3>Nobody seems to be online :/</h3>    
                </div>}
            </div>
        )
    }
}

const propMap = state => ({
    conversations: state.conversations,
    user: state.auth.user
})

export default connect(propMap, {setSocket, setOnline})(MessagingPage);