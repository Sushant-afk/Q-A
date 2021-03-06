import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOGOUT
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null
}

export default function(state = initialState, action){
       const { type, payload } = action;

       switch(type) {
           
          case REGISTER_SUCCESS: 
          case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)  
            return {
                ...state,
                token: payload,
                isAuthenticated: true,
                loading: false
            }
          case USER_LOADED: 
            return {
                ...state,
                user: payload,
                isAuthenticated: true,
                loading: false
            }  
          case REGISTER_FAIL:
          case LOGIN_FAIL:
          case AUTH_ERROR: 
          case USER_LOGOUT:
              localStorage.removeItem('token')   
              return {
                  ...state,
                  token: null,
                  isAuthenticated: false,
                  loading: false
              } 
          default:
              return state;     
       }
}