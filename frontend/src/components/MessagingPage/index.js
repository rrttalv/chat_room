import React, { Component } from 'react'
import socketIOClient from 'socket.io-client';
import { setSocket, setOnline } from '../../actions/conversationActions';
import { connect } from 'react-redux';

class MessagingPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            userList: [],
        }
    }

    componentDidMount(){
        let { socket } = this.props.conversations;
        const { userName } = this.props.user;
        const endPoint = 'http://127.0.0.1:8080';
        if(!socket){
            socket = socketIOClient(endPoint, {
                path: '/socket',
            });
            socket.emit('subscribe', {
                room: 'public-room', 
                user: userName,
            });
        };
        socket.on('public_join', data => {
            const sanitizedList = data.list.filter(u => u !== userName);
            this.props.setOnline(sanitizedList);
        });
    }

    render() {
        const { online } = this.props.conversations;
        return (
            <div>
                {online.map((elem, i) => (
                    <div key={i}>
                        {elem}
                    </div>
                ))}
            </div>
        )
    }
}

const propMap = state => ({
    conversations: state.conversations,
    user: state.auth.user
})

export default connect(propMap, {setSocket, setOnline})(MessagingPage);