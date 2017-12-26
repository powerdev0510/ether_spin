import React, {Component} from 'react';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as regsiterActions from 'store/modules/register';
import * as formActions from 'store/modules/form';

import { Register } from 'components';

class RegisterContainer extends Component {

    render() {
        // const { modal } = this.props;
        // const { changeInput } = this.props.FormActions;
        return (
            <div className='reg-con'>
                <Register {...this.props} />
            </div>
        );
    }
}

export default connect( 
    (state) => ({
        form: state.form.get('register').toJS(),
        formError: state.form.getIn(['error','register']).toJS(),
        status: {
            usernameExists: state.register.get('usernameExists'),
            isChecking: state.register.get('checkingUserName'),
            submitting: state.register.get('submitStatus')
        }
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(regsiterActions, dispatch),
        FormActions: bindActionCreators(formActions, dispatch),
    })
)(RegisterContainer);
