import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_QUESTIONS,
    QUESTION_ERROR,
    GET_QUESTION,
    POST_QUESTION,    
    POST_ANSWER,
    UPDATE_QUESTION,
    DELETE_QUESTION,
    UPDATE_ANSWER,
    DELETE_ANSWER,
    VOTE_QUESTION,
    VOTE_ANSWER
} from  './types';

// getting all questions

export const getAllQuestions = (page) => async dispatch => {

    try {
         const res = await axios.get(`/api/question?page=${page}&limit=5`);
         console.log(res.data);
         dispatch({
             type: GET_QUESTIONS,
             payload: res.data
         })
    } catch (err) {
        dispatch({
            type: QUESTION_ERROR,
            payload: null
        })
    }
}

// GET SINGLE QUESTION 

export const getThisQuestion = id => async dispatch => {

    try {
        const res = await axios.get(`/api/question/${id}`);
        dispatch({
            type: GET_QUESTION,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: QUESTION_ERROR,
            payload: null
        })
    }
}

// POST QUESTION

export const postThisQuestion = question => async dispatch => {
    
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(question);

    try {
        
        const res = await axios.post('/api/question', body, config);
        dispatch({
            type: POST_QUESTION,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: QUESTION_ERROR,
            payload: null
        })
    }
}

// POST ANSWER

export const postThisAnswer = answerData => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(answerData);

    try {
        
        const res = await axios.put(`/api/question/answer/${answerData.qid}`, body, config);
        dispatch({
            type: POST_ANSWER,
            payload: res.data
        })
    } catch (err) {
        alert(' some error has occured! please refresh the page and try again! ');
      
    }
    
}

// UPDATE QUESTION

export const updateThisQuestion = questionData => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(questionData);
    try {
        
        const res = await axios.put(`/api/question/${questionData.qid}`, body, config);
        dispatch({
            type: UPDATE_QUESTION,
            payload: res.data
        });
        
    } catch (err) {
        alert(' some error has occured! please refresh the page and try again! ');
    }
    
}

// DELETE THE QUESTION

export const deleteThisQuestion = id => async dispatch => {

    try {
        
        await axios.delete(`/api/question/${id}`);
        dispatch({
            type: DELETE_QUESTION
        });

        dispatch(setAlert('Question removed!'));

    } catch (err) {
        alert(' some error has occured! please refresh the page and try again! ');
    }
    
}

// UPDATE THE ANSWER

export const updateThisAnswer = ({answer, qid, aid}) => async dispatch => {
   
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        const body = JSON.stringify({answer, qid, aid});
        try {
            
            const res = await axios.put(`/api/question/answer/${qid}/${aid}`, body, config);
            dispatch({
                type: UPDATE_ANSWER,
                payload: res.data
            });
            dispatch(setAlert('Answer updated'));
        } catch (err) {
            alert(' some error has occured! please refresh the page and try again! ');  
        }
}

// DELETE THE ANSWER

export const deleteThisAnswer = ({ qid, aid }) => async dispatch => {

    try {
        
        const res = await axios.delete(`/api/question/answer/${qid}/${aid}`);
        dispatch({
            type: DELETE_ANSWER,
            payload: res.data
        });

        dispatch(setAlert('Answer removed!'));

    } catch (err) {
        alert(' some error has occured! please refresh the page and try again! ');
    }
    
}

// UPVOTE/DOWNVOTE THE QUESTION

export const voteThisQuestion = ({QuestId, voteType}) => async dispatch => {

    try {
         
        const res = await axios.put(`/api/question/${voteType}/${QuestId}`);
       
        dispatch({
            type: VOTE_QUESTION,
            payload: res.data
        })
    } catch (err) {
        alert(' some error has occured! please refresh the page and try again! ');
    }
}

// UPVOTE/DOWNVOTE THE ANSWER

export const voteThisAnswer = ({qid, aid, voteType}) => async dispatch => {

    try {
         
        const res = await axios.put(`/api/question/answer/${voteType}/${qid}/${aid}`);

        dispatch({
            type: VOTE_ANSWER,
            payload: res.data
        })
    } catch (err) {
        alert(' some error has occured! please refresh the page and try again! ');
    }
}