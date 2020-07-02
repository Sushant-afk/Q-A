import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOGOUT,
    DELETE_SESSION
} from './types';

// action creator for loading user

export const loadUser = () => async dispatch => {

    // console.log('loadUser called')

    if(!localStorage.token) return;

    else if(localStorage.token){
       setAuthToken(localStorage.token);
    }

    try {
         let res = await axios.get('/api/auth');
         dispatch({ 
             type: USER_LOADED,
             payload: res.data
         })
    } catch (err) {
         dispatch({
             type: AUTH_ERROR,
             payload: null
         })
    }
}

// action creator for registering users

export const register = ({ name, email, password }) => async dispatch => {

    // console.log('register called')
   
   const config = {
       headers:{
           'Content-Type': 'application/json'
       }
   }

   const body = JSON.stringify({ name, email, password });
    try {      
        const res = await axios.post('/api/users', body, config);
        
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
         
         dispatch({
            type: REGISTER_FAIL,
            payload: null
        })
    }
        
}

// action creator for logging in users

export const login = ({ email, password }) => async dispatch => {
    // console.log('login called')
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
 
    const body = JSON.stringify({ email, password });
    try {      
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
     
        const errors = err.response.data.errors;
        
        if (errors) {
          errors.forEach(error =>dispatch(setAlert(error.msg)));
        }
    
         dispatch({
            type: LOGIN_FAIL,
            payload: null
        })
    }
    
}

// action for logging user out

export const logout = () => (dispatch) => {
 
    dispatch({ type: DELETE_SESSION })
    dispatch({ type: USER_LOGOUT });
   //  dispatch({ type: CLEAR_PROFILE });  WILL HAVCE TO CLEAR ENTIRE DATA REQUESTED ONCE LOGGED OUT
}  