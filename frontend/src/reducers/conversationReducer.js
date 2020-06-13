import {
    LOADING_CONVERSATIONS, 
    STOP_LOADING, 
    GET_CONVERSATIONS,
    SET_SOCKET
} from '../actions/constants';

const initState = {
    conversations: [],
    socket: undefined,
    loading: false,
}

export default (state=initState, action) => {
    switch(action.type){
        case LOADING_CONVERSATIONS:
            return {
                ...state,
                loading: true,
            }
        case STOP_LOADING:
        case GET_CONVERSATIONS:
        case SET_SOCKET:
            return {
                ...state,
                loading: false,
                ...action.payload,
            }
        default:
            return state
    }
}