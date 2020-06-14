import { Input } from 'reactstrap';
import React, { Component } from 'react';
import './style.css';
export default class MessageInput extends Component {
    render() {
        const { handleChange, handleKeyup, placeholder, customClass, name, value } = this.props;
        return (
            <Input
                className={customClass ? `${customClass} message-input` : 'message-input'}
                placeholder={placeholder}
                name={name}
                onChange={handleChange}
                value={value || ''}
                onKeyUp={handleKeyup ? handleKeyup : undefined}
            />
        )
    }
}
