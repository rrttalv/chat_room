import React, { Component } from 'react'
import socketIOClient from 'socket.io-client';
import { setSocket } from '../../actions/conversationActions';
import { connect } from 'react-redux';

class OnlineList extends Component {

    componentDidMount(){
        let { socket } = this.props.conversations;
        const endPoint = 'http://127.0.0.1:8080';
        if(!socket){
            socket = socketIOClient(endPoint, {
                path: '/socket',
            });
        }
        console.log(socket)
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}

const propMap = state => ({
    conversations: state.conversations
})

export default connect(propMap, {setSocket})(OnlineList);