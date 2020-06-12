import { combineReducers } from 'redux';
import auth from './authReducer';
import convo from './conversationReducer';

export default combineReducers({
    auth: auth,
    conversations: convo,
})