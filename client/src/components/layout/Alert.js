import React, { Fragment } from 'react';
import { connect } from 'react-redux';


const Alert = ({ alert:{ message }}) => {

    const styleDiv = {
        position: "sticky",
        top: '0px',
        left:'0px',
        width:'100%',
        height:'50px',
        backgroundColor: 'rgb(211, 63, 120)',
        display: 'flex',justifyContent: 'center',alignItems: 'center',
        zIndex:'999'
    }

    const styleText = {
        fontSize: '20px',color:'white',
        fontFamily : " 'Raleway', sans-serif "
    }


    return (
        <Fragment>
            {
                message && (<div className = 'alert-div' style = {styleDiv}>
                <p className = 'alert-text' style = {styleText}> { message } </p>  
              </div>)
            }
        </Fragment>
    )
}

const mapStateToProps = state => {
    return {
        alert: state.alert
    }
}

export default connect(mapStateToProps, { })(Alert);
