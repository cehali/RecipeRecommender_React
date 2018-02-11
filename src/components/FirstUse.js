import React, { Component } from 'react'
import {Paper, SelectField, MenuItem, TextField, RaisedButton, Snackbar } from 'material-ui'
import {blueGrey900} from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900,
    }
})

const loginStyle = {
	width: '90%',
	maxWidth: '350px',
	margin: '20px auto',
	padding: '10px',
}

const InputStyle = {
	width: '100%',
}

class FirstUse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			valueGender: null,
			valueDietType: null,
			valueCalorie: 0,
			alertOpen: false,
			userEmail: this.props.location.state.userEmail
		}
		this.handleChangeGender = this.handleChangeGender.bind(this)
		this.handleChangeDietType = this.handleChangeDietType.bind(this)
		this.handleChangeCalories = this.handleChangeCalorie.bind(this)
	}

	handleChangeGender = (event, index, value) => this.setState({valueGender: value})
	handleChangeDietType = (event, index, value) => this.setState({valueDietType: value})
	handleChangeCalorie = (event, value) => {
		this.setState({valueCalorie: value})
		if (this.state.valueGender != null && this.state.valueDietType != null) {
			this.setState({canSubmit: true})
		}
	}

	submit = () => {
		if (this.state.valueCalorie < 1000) {
			this.setState({alertOpen: true})
		} else {
			this.props.history.push('/coldstart', {userEmail: this.state.userEmail, dietType: this.state.valueDietType, 
				gender: this.state.valueGender, calorieIntake: this.state.valueCalorie})
		}
	}

	handleRequestClose = () => this.setState({alertOpen: false})

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<Snackbar
						open={this.state.alertOpen}
						message='Calorie intake value has to be bigger than 1000'
						autoHideDuration={4000}
						onRequestClose={this.handleRequestClose}
					/>
					<Paper style={loginStyle} zDepth={2}>
					<h3>Please provide information presented below</h3>
						<SelectField
								floatingLabelText='Gender?'
								value={this.state.valueGender}
								onChange={this.handleChangeGender}
								autoWidth={true}
								style = {InputStyle}
								>
								<MenuItem value='Woman' primaryText='Woman' />
								<MenuItem value='Man' primaryText='Man' />
						</SelectField>
						<SelectField
								floatingLabelText='Diet Type?'
								value={this.state.valueDietType}
								onChange={this.handleChangeDietType}
								autoWidth={true}
								style = {InputStyle}
								>
								<MenuItem value='withoutMeat' primaryText='Without Meat' />
								<MenuItem value='withoutFish' primaryText='Without Fishes' />
								<MenuItem value='withoutDiary' primaryText='Without Diary' />
								<MenuItem value='vegetarian' primaryText='Vegetarian (without meat and fishes)' />
								<MenuItem value='vegan' primaryText='Vegan (without meat, fishes and diary)' />
								<MenuItem value='everything' primaryText='I eat everything' />
						</SelectField>
						<TextField
							floatingLabelText='Planned daily calorie intake'
							type='number'
							style = {InputStyle}
							onChange = {this.handleChangeCalorie}
						/>
						{this.state.canSubmit ? <RaisedButton label='SUBMIT' primary={true} onClick={this.submit} style={InputStyle} disabled={false}/> 
						: <RaisedButton label='SUBMIT' primary={true} onClick={this.submit} style={InputStyle} disabled={true}/>}						
					</Paper>
				</div>	
			</MuiThemeProvider>
		)
	}
}

export default FirstUse