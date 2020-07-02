import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllQuestions } from '../../actions/questions';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import './Questions.css';
import Spinner from '../spinner/Spinner';

const disabled = {  background:'gray', cursor:'', padding:'5px', margin:'0px 5px', outline:'none', color: 'white', border: 'none'}

const buttonStyle = {
  background:'rgb(42, 123, 167)',
  padding:'5px',
  color:'white',
  margin:'0px 5px',
  cursor:'pointer',
  borderRadius: '2px',
  outline:'none',
  border: 'none'
}

const Questions = ({ getAllQuestions, questions:{ questions, loading, page, maxpage } }) => {

    // let [currentPage, setPage] = useState(1);

    useEffect(() => {
        getAllQuestions(1);
    }, [getAllQuestions]);

    const changePage = (e, query) => {
       
      if(query === 'previous') getAllQuestions(page-1);
      else if(query === 'next') getAllQuestions(page+1);
      else alert('some error occured!');
    }

    return (
        <div className = 'questions'>
          <div className = 'feeds'>
            {
              !loading && questions !== null ? (
                <Fragment>
                  {
                    questions.map((question, index) => (

                      <div className = 'question-div' key = {index}>
                        <div className = 'asker'>
                          <p className=' mb'> <b>{ question.name }       </b><small className='date'><Moment format="D MMM YYYY" withTitle>{ question.date }</Moment></small> </p>
                          <p className=' tag mb'><b>{ question.tags }</b></p>
                        </div>
                        <div className='question'>
                          <p>{ question.question }</p>
                        </div>
                        <div className = 'vote'>
                        <p className = 'ans-count'>
                          {
                            question.answers.length === 1 ?(
                              <Fragment> 1 Answer </Fragment>
                            ):(<Fragment><b> {question.answers.length} Answers </b></Fragment>)
                          }
                        </p>
                        <Link to = {`/questions/${question._id}`} className='discussion'>
                          Discussion
                        </Link>
                        </div>
                      </div>    
                    ))   
                  }
                  <div>
                   { page > 1 ? <button style = {buttonStyle} onClick={(e) => changePage(e, 'previous')}> Previous </button> : <button onClick={(e) => alert('No Further pages!')} style={disabled}> Previous </button>}
                   { page < maxpage ? <button style = {buttonStyle} onClick={(e) => changePage(e, 'next')}> Next </button> : <button onClick={(e) => alert('No Further pages!')} style = {disabled}>  Next </button> }
                  </div>
                </Fragment>
              )  : (<Fragment>
                <Spinner/>
              </Fragment>)
            }
          </div>  
        </div>
    )
}

Questions.propTypes  = {
  getAllQuestions: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired
}


const mapStateToProps = state => {
    return {
        questions: state.questions
    }
}

export default connect(mapStateToProps, { getAllQuestions })(Questions);