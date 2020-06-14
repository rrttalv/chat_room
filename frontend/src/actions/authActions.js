import { AUTH_LOADING,
    AUTH_SUCCESS, 
    STOP_LOADING } from './constants'
import { history } from '../index';

export const getAuthStatus = () => (dispatch, getState) => {
    dispatch({
        type: AUTH_LOADING,
    })
    const url = '/auth/state';
    if(getState().auth.user){
        fetch(url, getOpts(getState, 'GET'))
        .then(data => data.json())
        .then(data => {
            const { user } = data;
            dispatch({
                type: AUTH_SUCCESS,
                payload: {isAuth: true, user},
            })
        }).catch(err => {
            //If server returns an error then the user is not "authenticated"
            localStorage.clear();
            console.log(err);
        });
    }else{
        dispatch({
            type: STOP_LOADING
        })
    }
    return;
};

export const initUser = body => (dispatch, getState) => {
    dispatch({
        type: AUTH_LOADING,
    });
    const url = '/auth/login';
    fetch(url, getOpts(getState, 'POST', body))
    .then(data => data.json())
    .then(data => {
        const { user } = data;
        dispatch({
            type: AUTH_SUCCESS,
            payload: {isAuth: true, user},
        });
        localStorage.setItem('user', JSON.stringify(user));
        history.push('/list');
        return;
    }).catch(err => {
        localStorage.clear();
        console.log(err);
    });
}

export const getOpts = (getState, method, body=undefined) => {
    const user = getState().auth.user;
    const opts = {
        method,
        headers: {
            'Content-type': 'application/json'
        }
    }
    if(user){
        //Invalid headers for this type but user is simulating a token here
        opts.headers['x-auth-token'] = user;
    }
    if(body){
        Object.assign(opts, {body: JSON.stringify(body)});
    }
    opts.headers['x-auth-user'] = user
    return opts;
};