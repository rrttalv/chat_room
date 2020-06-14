import {
    SET_ONLINE,
    SET_SOCKET,
    SET_CONVERSATION,
} from './constants';

export const updateChat = newData => (dispatch, getState) => {
    const prev = getPrev(getState);
    const { selected } = prev;
    if(!selected.data){
        selected.data = newData;
    }
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