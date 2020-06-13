import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
    let redirTo = "/";
    console.log(authenticated)
    return (
        <Route 
        {...rest} 
        render = { props => (authenticated ? 
            <Component {...props} /> 
            : 
            <Redirect 
                to={{ 
                    pathname: redirTo, 
                    state: { from: props.location } 
                }}
            />)
        }
        />
    );
};