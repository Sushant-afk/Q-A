import React from 'react';
import './answers.css'

const NoAnswers = (props) => {
    return (
        <div className = 'noanswers-div'>
           <p className = 'noanswer-text'> {props.text} </p>
        </div>
    )
}

export default NoAnswers;
