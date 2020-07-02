import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'

const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading },
    ...rest
  }) => {
    return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default connect(mapStateToProps)(PrivateRoute);