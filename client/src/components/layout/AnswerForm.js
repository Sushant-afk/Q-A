import React, {useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { postThisAnswer } from '../../actions/questions';
import { setAlert } from '../../actions/alert'

const AnswerForm = ({ postThisAnswer, qid, setAlert }) => {

    const [answer, setAnswer] = useState('');

    const onAnswerChange = (e) => {
        setAnswer(e.target.value)
    }

    const submitAnswer = (e) => {
        e.preventDefault();
        if(!answer.trim()) {
            alert(' please enter answer before submitting ');
        }
        else {
          const data = {
              answer: answer.trim(),
              qid
          }

          postThisAnswer(data);
          setAnswer('');
          setAlert('Answer added!');
        }
    }

    return (
        <Fragment>
            <form onSubmit = {(e) => submitAnswer(e)}>
                <textarea rows = "8" className = 'answer-input' onChange = {(e) => onAnswerChange(e)} value = {answer} placeholder = 'Enter your answer here...'/>
                <button className = 'answer-sub-btn'>Submit your answer</button>
            </form>
        </Fragment>
    )
}

export default connect(null, { postThisAnswer, setAlert })(AnswerForm);