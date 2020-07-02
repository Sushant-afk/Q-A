import React, { Fragment, useState } from 'react';
import { updateThisAnswer } from '../../actions/questions';
import { deleteThisAnswer } from '../../actions/questions';
import  { voteThisAnswer } from '../../actions/questions';
import Moment from 'react-moment';
import { connect } from 'react-redux';

// IMPORTING ICONS
import { AiFillHeart } from "react-icons/ai";
import { IoIosHeartDislike } from "react-icons/io";
import { AiFillDelete } from 'react-icons/ai';
import { AiFillEdit } from 'react-icons/ai';

import Modal from 'react-modal';

const Answers = ( { answers, auth, updateThisAnswer, qid, deleteThisAnswer, voteThisAnswer } ) => {

   const [answerModal, setAnswerModal] = useState(false);
   let [editedAnswer, setEditedAnswer] = useState('');

   const onSubmit = (e, ans) => {
    e.preventDefault();
    let aid = ans._id;
    updateThisAnswer({
        answer: editedAnswer,
        qid: qid,
        aid: aid
  
    });
    
    setAnswerModal(false);
  }

  const deleteAnswer = (ans) => {
    let aid = ans._id;
    deleteThisAnswer({ qid, aid });
  }

  const vote = (e, qid, ans, voteType) => {
    var aid = ans._id;      
    voteThisAnswer({ qid, aid, voteType});
}

    return (
        <div className = 'answer-div-cont'>
           {
            answers !== null ? (
              <Fragment>
              {
                answers.map((answer, index) => (
                <div className = 'answer-div' key = {index}>
                    <div className = 'name-div'>
                        <p> answered by  <b className = 'name-text'> { answer.name } </b><small><Moment format="D MMM YYYY" withTitle>{ answer.date }</Moment></small> </p>
                    </div>
                    <div className = 'answer-text-div'>
                        <p className = 'answer-text'> { answer.answer } </p>
                    </div>
                    <div className = 'ans-vote-div'>
                      {
                        auth.user && answer.upvotes.some(upvote => upvote.user === auth.user._id) ? <Fragment><AiFillHeart size='1rem'  className='icon red' onClick = {(e) => vote(e, qid, answer, 'upvote')}/><span className='vote-count'> {answer.upvotes.length} </span></Fragment> : <Fragment><AiFillHeart size='1rem'  className='icon black' onClick = {(e) => vote(e, qid, answer, 'upvote')}/><span className='vote-count'> {answer.upvotes.length} </span></Fragment>
                      }
                      {
                        auth.user && answer.downvotes.some(downvote => downvote.user === auth.user._id) ? <Fragment> <IoIosHeartDislike size='1rem' className='icon red' onClick = {(e) => vote(e, qid, answer, 'downvote')}/><span className='vote-count'> {answer.downvotes.length} </span></Fragment> : <Fragment> <IoIosHeartDislike size='1rem' className='icon black' onClick = {(e) => vote(e, qid, answer, 'downvote')}/><span className='vote-count'> {answer.downvotes.length} </span></Fragment>
                      }
                      
                      {
                        auth.user && answer.user && answer.user === auth.user._id ? (
                          <Fragment>
                            <AiFillDelete size='1rem' className='private-icon' onClick = {(e) => deleteAnswer(answer)}/>
                            <AiFillEdit size='1rem' className='private-icon' onClick = { () => setAnswerModal(true)}/>
                            <Modal isOpen = { answerModal } onRequestClose = { () => setAnswerModal(false)}>
                              <form onSubmit = { (e) => onSubmit(e, answer)}>
                                    <div className = "form-group-2">
                                      <label className = "label"> Edit Answer </label><br/>
                                      <input value = {editedAnswer} type = "text" name='answer' placeholder = "write answer here..." onChange = { (e) => setEditedAnswer( e.target.value )} required/>
                                    </div>
                                    <div className = "form-group-2">
                                      <button type = "submit" className = 'auth-btn-modal'> Save changes </button>
                                    </div> 
                              </form>        
                            </Modal>

                          </Fragment>
                        ) : (<Fragment></Fragment>)
              }


                    </div>
                  </div>   
                ))  
            }
                </Fragment>
               ): (
                <div className = 'noanswers-div'>
                   <p className = 'noanswer-text'> Loading answers... </p>
                </div>
               )
           }
        </div>
    )
}

const mapStateToProps = state => {
  return {
      auth: state.auth
  }
}

export default connect(mapStateToProps, { updateThisAnswer, deleteThisAnswer, voteThisAnswer })(Answers);