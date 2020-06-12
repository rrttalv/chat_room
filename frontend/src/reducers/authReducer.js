import { AUTH_LOADING, AUTH_SUCCESS } from '../actions/constants';

const initState = {
    isAuth: false,
    user: false,
}

export default (state = initState, action) => {
    switch(action.type){
        case AUTH_LOADING:
            return {
                ...state,
                loading: true,
            }
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