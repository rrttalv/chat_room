import React, { Component } from 'react'
import socketIOClient from 'socket.io-client';
import { setSocket } from '../../actions/conversationActions';
import { connect } from 'react-redux';

class OnlineList extends Component {

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
            console.log(data)
            this.setState({userList: sanitizedList});
        });
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}

const propMap = state => ({
    conversations: state.conversations,
    user: state.auth.user
})

export default connect(propMap, {setSocket})(OnlineList);