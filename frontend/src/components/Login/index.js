import React, { Component, Fragment } from 'react'
import { Input, FormGroup } from 'reactstrap';
import './style.css';
import MessageInput from '../MessageInput';
export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
        }
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <Fragment>
                <div id="seperator"></div>
                <div>
                    <h1>Join the chat!</h1>
                    <FormGroup>
                        <MessageInput 
                        placeHolder={"Username"}
                        handleChange={this.handleChange}
                        />
                    </FormGroup>
                </div>
            </Fragment>
        )
    }
}
