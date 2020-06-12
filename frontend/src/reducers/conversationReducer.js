import {LOADING_CONVERSATIONS, GET_CONVERSATIONS} from '../actions/constants';

const initState = {
    conversations: [],
    loading: false,
}

export default (state=initState, action) => {
    switch(action.type){
        case LOADING_CONVERSATIONS:
            return {
                ...state,
                loading: true,
            }
        case GET_CONVERSATIONS:
            return {
                ...state,
                loading: false,
                ...action.payload,
            }
        default:
            return state
    }
}