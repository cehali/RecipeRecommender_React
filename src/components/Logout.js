import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { app } from '../base';
import RefreshIndicator from 'material-ui/RefreshIndicator'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


const style = {
	refresh: {
	  display: 'inline-block',
	  position: 'relative',
	}
}

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
					<div style={{ textAlign: 'center', position: 'absolute', top: '25%', left: '50%'}}>
						<h3>Logging Out</h3>
						<RefreshIndicator
							size={50}
							status="loading"
							style={style.refresh}
							left={0}
							top={0}
						/>
					</div>
				</MuiThemeProvider>
			)       
    }
}

export default Logout