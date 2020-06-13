import React, { Component } from 'react'
import './style.css';

export default class UserElement extends Component {
    render() {
        const { name, handleClick, unread } = this.props;
        console.log(name)
        return (
            <div className="name-container">
                <div 
                    onClick={handleClick}
                    className="click-wrapper"
                >
                    <span>{name}</span>
                    {unread ? 
                    <div className="unread">
                        <span>unread</span>
                        <span>{unread}</span>
                    </div> : 
                    <span></span>}
                </div>
            </div>
        )
    }
}
