import { Input } from 'reactstrap';
import React, { Component } from 'react';
import './style.css';
export default class MessageInput extends Component {
    render() {
        const { handleChange, handleKeyup, placeHolder, customClass } = this.props;
        return (
            <Input
                className={customClass ? `${customClass} message-input` : 'message-input'}
                placeholder={placeHolder}
                onChange={handleChange}
                onKeyUp={handleKeyup ? handleKeyup : undefined}
            />
        )
    }
}
