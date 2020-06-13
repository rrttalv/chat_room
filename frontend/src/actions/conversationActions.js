import {
    STOP_LOADING,
    GET_CONVERSATIONS,
    LOADING_CONVERSATIONS
} from './constants';
import {
    getOpts
} from './authActions';


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