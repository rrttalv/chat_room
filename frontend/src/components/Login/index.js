import React, { Component, Fragment } from 'react'
import { Input, FormGroup, Form } from 'reactstrap';
import './style.css';
import MessageInput from '../MessageInput';
import SendBtn from '../SendBtn';
import { connect } from 'react-redux';
import { initUser } from '../../actions/authActions';
class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
        }
    }

    handleChange = e => {
        if(e.target.keyCode === 13){
        }
        this.setState({[e.target.name]: e.target.value});
    }

    handleAuth = () => {
        this.props.initUser({...this.state});
    }

    render() {
        const { loading } = this.props.auth;
        return (
            <Fragment>
                <div id="seperator"></div>
                <Form>
                    <h1>Join the chat!</h1>
                    {
                    !loading ? 
                    <FormGroup>
                        <MessageInput 
                            placeholder={"username"}
                            name={"username"}
                            handleChange={this.handleChange}
                        />
                        <SendBtn 
                        handleClick={this.handleAuth}
                        text={"Start"}
                        />
                    </FormGroup> 
                    : 
                    <div></div>
                    }
                </Form>
            </Fragment>
        )
    }
}

const propMap = state => ({
    auth: state.auth,
})

export default connect(propMap, { initUser })(Login)