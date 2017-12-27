import React, { Component } from 'react'
import { Login } from 'components';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';
import * as formActions from 'store/modules/form';

class LoginContainer extends Component {
  render () {
    return (
      <div>
        <Login {...this.props}/>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    form: state.form.get('login').toJS(),
    status: {
        logged: state.auth.getIn(['session', 'logged']),
        submitting: state.auth.get('submitStatus'),
        session: state.auth.get('session').toJS()   
    }
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    FormActions: bindActionCreators(formActions, dispatch),
  })
)(LoginContainer);