import { 
    SHOW_ALERT,
    REMOVE_ALERT
} from '../actions/types';

const initialState = {
    message: ''
}

export default function (state = initialState, action) {
    const { payload, type } = action;

    switch(type) {
        case SHOW_ALERT:
            return {
               ...state,
               message: payload
            }
        case REMOVE_ALERT:
            return {
                ...state,
                message: ''
            }
        default:
            return state        
    }
}