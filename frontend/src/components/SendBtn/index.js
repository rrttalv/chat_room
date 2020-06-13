import React, { Component } from 'react'
import './style.css'
export default class SendBtn extends Component {
    render() {
        const { text, handleClick, customClass } = this.props;
        return (
            <button
                className={customClass ? customClass + ' btn send' : 'btn send'}
                onClick={handleClick}
            >
                {text}
            </button>
        )
    }
}
