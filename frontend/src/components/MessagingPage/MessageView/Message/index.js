import React, { Component } from 'react';
import './style.css';

export default class Message extends Component {
    render() {
        const { message, isOwner } = this.props;
        return (
            <div className={isOwner ? 'message-wrapper personal' : 'message-wrapper'}>
                <span
                    className='message-content'
                >
                    {message}
                </span>
            </div>
        )
    }
}
