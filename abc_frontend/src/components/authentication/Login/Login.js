import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import {LoginForm} from 'components';
import {storage} from 'helpers';
import notify from 'helpers/notify'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl';

// socket
import sender from 'socket/packetSender';

import './Login.scss';

const messages = defineMessages({
    greeting: {
        id: "Login.notify.greeting",
        defaultMessage: "Hello, {name}!"
    },
    failure: {
        id: "Login.notify.failure",
        defaultMessage: "Incorrect username or password"
    },
    regexFailure: {
        id: "Login.notify.regexFailure",
        defaultMessage: "Please check your username or password"
    }
})

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animate: false,
            leave: false,
            path: ''
        };
    }


    handleChange = (e) => {
        const {FormActions} = this.props;
        FormActions.changeInput({form: 'login', name: e.target.name, value: e.target.value})
    }


    leaveTo = ({
        path,
        express = false
    }) => {
        this.setState({animate: true, path});

        if (express) {
            alert('express in');
            if (process.env.NODE_ENV === 'development') {
                document.location.href = "http://18.217.245.201:3000" + path;
            } else {
                document.location.href = path;
            }
            return;
        }
        setTimeout(() => this.setState({leave: true}), 700)
    }

    connectToChatRoom = () => {
        const { status } = this.props;
       
        const { sessionID } = status.session;
        sender.auth(sessionID, false);
    }
    handleSubmit = async () => {
        const {form, status, FormActions, AuthActions, intl: {
                formatMessage
            }} = this.props;

        const {username, password} = form;

        notify.clear();

        const regex = /^[0-9a-zA-Z]{4,30}$/;

        if (!(regex.test(username) && regex.test(password))) {
            //toastr.error('Please check your username or password');
            notify({type: 'error', message: formatMessage(messages.regexFailure)});
            return;
        }

        AuthActions.setSubmitStatus(true);

        try {
            await AuthActions.localLogin({displayName:username, password});
        } catch (e) {
            //toastr.error('Incorrect username or password');
            notify({type: 'error', message: formatMessage(messages.failure)});
            AuthActions.setSubmitStatus(false);
            return;
        }

        // if(this.props.location.state.prevPath) {     
        //     this.leaveTo({path: this.props.location.state.prevPath}) 
        // } else { 
        //     this.leaveTo({path: '/'});
        // }

        const redirect = storage.get('redirect');
        if (redirect) {
            // redirect and clear it
            this.leaveTo({path: redirect.prevPath});
            storage.remove('redirect');
        } else {
            this.leaveTo({path: '/'});
        }
        // this.leaveTo({path: '/'});

        // toastr.success(`Hello,
        // ${this.props.status.session.user.common_profile.givenName}!`);
        notify({type: 'success', message: formatMessage(messages.greeting, {name: username})});
        // storage.set('session', this.props.status.session);

        this.connectToChatRoom();
        
        AuthActions.setSubmitStatus(false);

    }


    handleKeyPress = (e) => {
        if (e.charCode === 13) {
            this.handleSubmit();
        }
    }

    render() {

        const redirect = (<Redirect to={this.state.path}/>);

        const {handleChange, handleSubmit, handleKeyPress, leaveTo} = this;
        const {form, status, intl: {
                formatMessage
            }} = this.props;

        return (
            <div className="login">
                <div
                    className={"box bounceInRight " + (this.state.animate
                    ? 'bounceOutLeft'
                    : '')}>
                    <div className="local">
                        <p className="title"><FormattedMessage id="Login.loginWithUsername"/></p>
                        <LoginForm
                            form={form}
                            status={status}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onKeyPress={handleKeyPress}/>
                        <div className="login-footer">
                            <p><FormattedMessage id="Login.newHere"/>&nbsp;<a onClick={() => this.leaveTo({path: '/signup'})}>
                                    <FormattedMessage id="Login.createAccount"/></a>
                            </p>
                            <p>
                                {<Link to="/">*
                                    <FormattedMessage id="Login.forgotPassword"/></Link>}
                            </p>
                        </div>
                    </div>

                    <div className="or">OR</div>
                    <div className="ui horizontal divider">
                        Or
                    </div>
                    <div className="social">
                        <p className="title"><FormattedMessage id="Login.socialLogin"/></p>
                        <div className="hide-on-mobile">
                            <button
                                className="ui facebook oauth button massive"
                                onClick={() => leaveTo({path: '/api/authentication/facebook', express: true})}>
                                <i className="facebook icon"></i>
                                Facebook
                            </button>

                            <button
                                className="ui google plus oauth button massive"
                                onClick={() => leaveTo({path: '/api/authentication/google', express: true})}>
                                <i className="google icon"></i>
                                Google
                            </button>
                        </div>
                        <div className="ui grid hide-on-desktop">
                            <div className="eight wide column">
                                <button
                                    className="ui facebook button icon massive"
                                    onClick={() => leaveTo({path: '/api/authentication/facebook', express: true})}>
                                    <i className="facebook icon"></i>
                                </button>
                            </div>
                            <div className="eight wide column">
                                <button
                                    className="ui google plus icon button massive"
                                    onClick={() => leaveTo({path: '/api/authentication/google', express: true})}>
                                    <i className="google icon"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.leave
                    ? redirect
                    : undefined}
            </div>
        );
    }

    componentWillUnmount() {
        this
            .props
            .FormActions
            .formReset();
    }
}

export default injectIntl(Login);