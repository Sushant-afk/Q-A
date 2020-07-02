import React, { useState, Fragment } from 'react';
import { login } from '../../actions/auth';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from './Footer';
import { setAlert } from '../../actions/alert';
import './auth.css'

const Login = ({ login, isAuthenticated, setAlert }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
     e.preventDefault();

     if( email.trim() && password.trim())
     {
        //  document.querySelector('button').disabled = true;
        //  document.querySelector('button').cursor = "not-allowed";
         login({ email, password })
     }
     
     else {
       
      setAlert('Please enter your credentials! ')
     }
       
  }

  if(isAuthenticated) {
      return <Redirect to = '/home' />
   }


    return ( 
      <Fragment>
        <div className = "container-x">

          <form className = "form" onSubmit = {e => onSubmit(e)}>
          <div className = 'form-group-1 log-title'> LOG IN </div>
            <div className = "form-group-2">
              <label className = "label">  Email:  </label><br/>
              <input type = "text" name='email' placeholder = "johndoe@example.com" vlaue = {email} onChange={(e) => onChange(e)} required/>
            </div> 
            <div className = "form-group-2">  
              <label className = "label">  Password:  </label><br/>
              <input type = "password" name='password' placeholder = "password..." value={password} onChange={(e) => onChange(e)} required/>
            </div>   
            <div className = "form-group-2">
              <button type = "submit" className = 'auth-btn'> Log In </button>
            </div> 
            <div className = "form-group message">
             Don't have an account ? <Link to='/register' className='link'><b>Sign up</b></Link>
            </div>
          </form>
        </div>
        <Footer/>
      </Fragment>
    )
}

Login.protoTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}


export default connect(mapStateToProps, { login, setAlert  })(Login);
