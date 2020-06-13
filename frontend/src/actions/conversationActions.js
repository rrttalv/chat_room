import {
    SET_ONLINE,
    GET_CONVERSATIONS,
    LOADING_CONVERSATIONS,
    SET_SOCKET,
    SET_CONVERSATION,
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

export const updateChat = data => (dispatch, getState) => {
    const prev = getPrev(getState);
    const { selected } = prev;
    if(selected.messages && selected._id === data._id){
        selected.messages.push(data.message);
    };
    dispatch({
        type: SET_CONVERSATION,
        payload: {...prev},
    });
};

export const setChat = data => (dispatch, getState) => {
    const prev = getPrev(getState);
    dispatch({
        type: SET_CONVERSATION,
        payload: {...prev, ...data},
    });
};

export const setSocket = socket => (dispatch, getState) => {
    const prev = getPrev(getState);
    dispatch({
        type: SET_SOCKET,
        payload: {...prev, socket: socket}
    });
};

export const setOnline = data => (dispatch, getState) => {
    const prev = getPrev(getState);
    dispatch({
        type: SET_ONLINE,
        payload: {...prev, online: data}
    });
};

const getPrev = getState => {
    return getState().conversations;
};