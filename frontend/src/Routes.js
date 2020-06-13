import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { AuthRoute } from "./AuthRoute"
import { connect } from 'react-redux';
import MessageList from './components/MessageList/index';
import Login from './components/Login/index';
import MessageView from './components/MessageView/index';

class Routes extends Component {
    render(){
        const { loading, isAuth } = this.props.auth;
        return (
            loading ? 
            <div></div>
            :
            <Switch>
                <Route exact path="/" component={Login} />
                <AuthRoute authenticated={isAuth} exact path="/list" component={MessageList} />
                <AuthRoute authenticated={isAuth} exact path="/list/:conversationID" component={MessageView} />
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