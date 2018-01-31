import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { app, facebookProvider } from '../base'
import { Snackbar, RaisedButton, Divider, TextField, Paper } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const loginStyle = {
	width: '90%',
	maxWidth: '315px',
	margin: '20px auto',
	padding: '10px',
}

const loginInputStyle = {
	width: '100%',
}

class Login extends Component {
	constructor(props) {
		super(props)
		this.authWithFacebook = this.authWithFacebook.bind(this)
		this.authWithEmailPassword = this.authWithEmailPassword.bind(this)
		this.state = {
			redirect: false,
			registerOpen: false,
			loginOpen: false,
			tryLoginFbOpen: false,
			unableloginFbOpen: false,
			emailValue:'',
			passwordValue: '',
			errOpen: false,
			err: ''
		}
	}

	authWithFacebook() {
		app.auth().signInWithPopup(facebookProvider)
			.then((result, error) => {
				if (error) {
					this.setState({ unableloginFbOpen: true })
				} else {
					this.setState({ 
						loginOpen: true,
						redirect: true 
					})
				}
			})
	}

	authWithEmailPassword() {
		const email = this.state.emailValue
		const password = this.state.passwordValue

		app.auth().fetchProvidersForEmail(email)
			.then((providers) => {
				if(providers.length === 0) {
					this.setState({
						redirect: true,
						registerOpen: true,
						emailValue: '',
						passwordValue:  ''
					})
					return app.auth().createUserWithEmailAndPassword(email, password)
				} else if (providers.indexOf('password') === -1) {
					this.setState({tryLoginFbOpen: true})
				} else {
					return app.auth().signInWithEmailAndPassword(email, password)
				}
			})
			.then((user) => {
				if (user && user.email) {
					this.setState({
						redirect: true,
						loginOpen: true,
						emailValue: '',
						passwordValue:  ''
					})
				}
			}).catch((error) => {
				this.setState({ 
					err: error.message,
					errOpen: true
				})
			})
	}

	handleEmailChange = (event) => {
		this.setState({
		  emailValue: event.target.value,
		});
	  };

	handlePasswordChange = (event) => {
		this.setState({
		  passwordValue: event.target.value,
		});
	};

	handleRequestClose = () => {
		this.setState({
			registerOpen: false,
			loginOpen: false,
			tryLoginFbOpen: false,
			unableloginFbOpen: false,
			errOpen: false
		})
	}

    render() {
		if (this.state.redirect === true) {
			return <Redirect to='/recipes' />
		}
        return (
			<MuiThemeProvider>
					<Snackbar
						open={this.state.registerOpen}
						message='New user has been made'
						autoHideDuration={4000}
						onRequestClose={this.handleRequestClose}
					/>
					<Snackbar
						open={this.state.loginOpen}
						message='You have been logged in'
						autoHideDuration={4000}
						onRequestClose={this.handleRequestClose}
					/>
					<Snackbar
						open={this.state.tryLoginFbOpen}
						message='Try alternative login'
						autoHideDuration={4000}
						onRequestClose={this.handleRequestClose}
					/>
					<Snackbar
						open={this.state.unableloginFbOpen}
						message='Unable to sign in with Facebook'
						autoHideDuration={4000}
						onRequestClose={this.handleRequestClose}
					/>
					<Snackbar
						open={this.state.errOpen}
						message={this.state.err}
						autoHideDuration={4000}
						onRequestClose={this.handleRequestClose}
					/>
					<Paper style={loginStyle} zDepth={2}>
						<RaisedButton label="Log In with Facebook" primary={true} style={loginInputStyle} 
							onClick={() => { this.authWithFacebook() }}/>
						<Divider/>					
						<h3>Note</h3>
						If you don't have account already, this form will create your account.
						<TextField
							floatingLabelText="Email"
							type='email'
							value={this.state.emailValue}
							onChange={this.handleEmailChange}
							style = {loginInputStyle}
						/>
						<TextField
							floatingLabelText="Password"
							type='password'
							value={this.state.passwordValue}
							onChange={this.handlePasswordChange}
							style = {loginInputStyle}
						/>
						<RaisedButton label="Log In" primary={true} style={loginInputStyle}
							onClick={() => { this.authWithEmailPassword() }}/>
					</Paper>
			</MuiThemeProvider>
        )
    }
}

export default Login