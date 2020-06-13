import { Input } from 'reactstrap';
import React, { Component } from 'react';
import './style.css';
export default class MessageInput extends Component {
    render() {
        const { handleChange, handleKeyup, placeHolder, customClass, name } = this.props;
        return (
            <Input
                className={customClass ? `${customClass} message-input` : 'message-input'}
                placeholder={placeHolder}
                name={name}
                onChange={handleChange}
                onKeyUp={handleKeyup ? handleKeyup : undefined}
            />
        )
    }
}
