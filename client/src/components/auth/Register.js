import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import Footer from './Footer';
import { Redirect, Link } from 'react-router-dom';
import './auth.css'

const Register = ({ register, isAuthenticated }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });


  const { name, email, password, password2} = formData;

  const onChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
     e.preventDefault();

     if(password !== password2) {
       alert("password doesn't match, please try again");
     } 
     else {
      // document.querySelector('button').disabled = true;
      // document.querySelector('button').cursor = "not-allowed";       
      register({ name, email, password });
     }

    //  console.log(isAuthenticated)

  }

  if(isAuthenticated) {
    return <Redirect to = '/home' />
  }

    return (
     <Fragment>
        <div className = "container-x">
          <div className = 'about'>
           <p> BUILT FOR ALIENS </p>
          </div>
         
          <form className = "form" onSubmit = {e => onSubmit(e)}>
            <div className = "form-group">
              <label className = "label">  Username:  </label><br/>
              <input type = "text" name='name' placeholder = "John doe" value={name} onChange={(e) => onChange(e)}/>
            </div> 
            <div className = "form-group">
              <label className = "label">  Email:  </label><br/>
              <input type = "text" name='email' placeholder = "johndoe@example.com" vlaue = {email} onChange={(e) => onChange(e)}/>
            </div> 
            <div className = "form-group">  
              <label className = "label">  Password:  </label><br/>
              <input type = "password" name='password' placeholder = "password..." value={password} onChange={(e) => onChange(e)}/>
            </div>  
            <div className = "form-group">
              <label className = "label">  Confirm Password:  </label><br/>
              <input type = "password" name='password2' placeholder = "password..." value = {password2} onChange={(e) => onChange(e)}/>
             <p className="message-2">Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter. <span className='link'>Learn more</span>.</p> 
            </div> 
            <div className = "form-group">
              <button type = "submit" className = 'auth-btn'> Sign up </button>
            </div>
            <div className = "form-group message">
             Already have an account? <Link to='/login' className='link'><b>Login</b></Link>
            </div> 
          </form>
        </div>
        <Footer />
        </Fragment>
    )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}


export default connect(mapStateToProps, { register })(Register);
