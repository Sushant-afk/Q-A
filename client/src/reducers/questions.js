import {
    GET_QUESTIONS,
    QUESTION_ERROR,
    GET_QUESTION,
    POST_QUESTION,
    POST_ANSWER,
    UPDATE_QUESTION,
    UPDATE_ANSWER,
    DELETE_ANSWER,
    VOTE_QUESTION,
    VOTE_ANSWER
} from  '../actions/types';

const initialState = {
    questions: [],
    page:1,
    maxpage:1000,
    question: null,
    loading: true
}



export default function( state= initialState, action) {
   
    const { type, payload } = action;

    switch(type) {
        case GET_QUESTIONS:
          return {
              ...state,
              page: payload.page,
              maxpage: payload.totalPages,
              questions: payload.questions,
              loading: false,
              question: null
          }
        case QUESTION_ERROR:
            return {
                ...state,
                questions: [],
                loading: false
            }
        case UPDATE_QUESTION:   
        case GET_QUESTION: 
        case POST_ANSWER: 
        case POST_QUESTION:
        case DELETE_ANSWER:
        case VOTE_QUESTION:
        case VOTE_ANSWER:        
        case UPDATE_ANSWER:   /* REMINDER ** DATA EXCHANGE ** */
            return {
                ...state,
                question: payload,
                loading: false
            }       
        default:
             return state;     
    }
}


