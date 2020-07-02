import {
    SHOW_ALERT,
    REMOVE_ALERT
} from './types';

export const setAlert = message => dispatch => {

    dispatch({
        type: SHOW_ALERT,
        payload: message
    });

     setTimeout(() => { dispatch({ type: REMOVE_ALERT })}, 3000);
}