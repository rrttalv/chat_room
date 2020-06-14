import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { AuthRoute } from "./AuthRoute"
import { connect } from 'react-redux';
import MessagingPage from './components/MessagingPage/index';
import Login from './components/Login/index';

class Routes extends Component {
    render(){
        const { loading, isAuth } = this.props.auth;
        return (
            loading ? 
            <div></div>
            :
            <Switch>
                <Route exact path="/" component={Login} />
                <AuthRoute authenticated={isAuth} exact path="/list" component={MessagingPage} />
            </Switch>
        )
    }
}

const propMap = state => {
    return {
        auth: state.auth,
    }
};

export default connect(propMap, null, null, {pure: false})(Routes);