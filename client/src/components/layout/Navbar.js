import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth'
import { NavLink } from 'react-router-dom';
import './Navbar.css'

const Navbar = ({ auth:{ isAuthenticated, loading, user }, logout }) => {

const unauthLinks = (
      <div className = "navigation-link">
        
      </div>  
)


const authLinks = (
      <div className = "navigation-link">
        <ul className = "ul-list">
            <li> <NavLink to = '/home' activeStyle={{fontWeight:"bold"}}> { user && user.name } </NavLink> </li>
            <li><NavLink to = '/questions' activeStyle={{fontWeight:"bold"}}> Feeds </NavLink> </li>
            <li>
              <a href='#!' onClick = {logout}>
              <span className='logout'>Logout</span>
              </a>
            </li>
        </ul>
      </div>   
)

    return (
      <header className = "header">
        <div className = "nav-container">
          <div className = "brand-icon" >
          <NavLink to = '/' activeStyle={{fontWeight:"bold"}}> Questionaire </NavLink>
          </div>
          { !loading && isAuthenticated === true ? authLinks : unauthLinks}
          
        </div>  
      </header>
      
    )
}


const mapStateToProps = (state) => {

  return {
      auth: state.auth
  }
}


export default connect(mapStateToProps, { logout })(Navbar);