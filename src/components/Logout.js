import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { app } from '../base';
import RefreshIndicator from 'material-ui/RefreshIndicator'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Logout extends Component {
	constructor() {
		super()
		this.state = {
			redirect: false
		}
	}
	componentWillMount() {
		app.auth().signOut().then((user) => {
			this.setState({ redirect: true })
		})
	}

    render() {
		if (this.state.redirect === true) {
			return <Redirect to='/' />
		}
		return (
			<MuiThemeProvider>
				<div style={{ position: 'relative' }}>
				<RefreshIndicator
					size={50}
					status={'loading'}
					top={30}
					left={-25}
					style={{marginLeft: '50%'}}
				/>
			</div>
			</MuiThemeProvider>
		)       
    }
}

export default Logout