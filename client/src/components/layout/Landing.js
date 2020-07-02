import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './landing.css';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/home' />;
  }

  return (
    <section className='landing'>
     <p> WELCOME TO QUESTIONAIRE!  </p><br/>
     <p> DON'T LET INTRUDERS CRAWL IN  </p><br />
     <p> <Link className='linkx' to = '/login'>Login</Link> | <Link className='linkx' to = '/register'>sign up</Link></p>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);