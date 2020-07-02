import axios from 'axios';

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from './types';

export const getCurrentProfile = () => async dispatch => {

    try {
         const res = await axios.get('/api/profile/me');
         dispatch({
             type: GET_PROFILE,
             payload: res.data
         })
    } catch (err) {
       
        dispatch({
           type: PROFILE_ERROR,
           payload: null
        })
    }
}

export const getProfile = id => async dispatch => {
  
    try {
        const res = await axios.get(`/api/profile/${id}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: null
        })
    }
}

export const createProfile = ( profileData, id ) => async dispatch => {
    
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }
 
    const body = JSON.stringify({ profileData });

    try {
        const res = await axios.post(`/api/profile/${id}`, body, config);
        
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        }); 
          
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: null
        })
    }
}