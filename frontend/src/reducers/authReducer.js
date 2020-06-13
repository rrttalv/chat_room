import { AUTH_LOADING, AUTH_SUCCESS, STOP_LOADING } from '../actions/constants';

const initState = {
    isAuth: false,
    user: localStorage.getItem('user'),
}

export default (state = initState, action) => {
    switch(action.type){
        case AUTH_LOADING:
            return {
                ...state,
                loading: true,
            }
        case STOP_LOADING:
        case AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload,
            }
        default: 
            return state
    }
}