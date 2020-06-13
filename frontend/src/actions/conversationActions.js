import {
    SET_ONLINE,
    GET_CONVERSATIONS,
    LOADING_CONVERSATIONS,
    SET_SOCKET
} from './constants';
import {
    getOpts
} from './authActions';

/*
    This can be used to display older conversations.
    Not going to be used for now.
*/
export const listConversations = () => (dispatch, getState) => {
    dispatch({
        type: LOADING_CONVERSATIONS,
    });
    const url = '/dash';
    fetch(url, getOpts(getState, 'GET'))
    .then(data => data.json())
    .then(data => {
        dispatch({
            type: GET_CONVERSATIONS,
            payload: {...data},
        });
    }).catch(err => {
        console.log(err);
    });
};

export const setSocket = socket => (dispatch, getState) => {
    const prevState = getState().conversations;
    dispatch({
        type: SET_SOCKET,
        payload: {...prevState, socket}
    });
};

export const setOnline = data => (dispatch, getState) => {
    const prevState = getState().conversations;
    dispatch({
        type: SET_ONLINE,
        payload: {...prevState, online: data}
    })
}