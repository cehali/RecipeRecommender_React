import React, { Component } from 'react'
import {Paper, SelectField, MenuItem, TextField, FloatingActionButton, RaisedButton } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'

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
			valueDietType: null
		}
		this.handleChangeGender = this.handleChangeGender.bind(this)
		this.handleChangeDietType = this.handleChangeDietType.bind(this)
	}

	handleChangeGender = (event, index, value) => this.setState({valueGender: value})
	handleChangeDietType = (event, index, value) => this.setState({valueDietType: value})

	render() {
		return (
			<MuiThemeProvider>
				<Paper style={loginStyle} zDepth={2}>
				<h3>Please provide presented information</h3>
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
							<MenuItem value='Without Meat' primaryText='Without Meat' />
							<MenuItem value='Without Fishes' primaryText='Without Fishes' />
							<MenuItem value='Without Diary' primaryText='Without Diary' />
							<MenuItem value='Vegetarian (without meat and fishes)' primaryText='Vegetarian (without meat and fishes)' />
							<MenuItem value='Vegan (without meat, fishes and diary)' primaryText='Vegan (without meat, fishes and diary)' />
							<MenuItem value='I eat everything' primaryText='I eat everything' />
					</SelectField>
					<TextField
						floatingLabelText='Planned daily calorie intake'
						type='number'
						style = {InputStyle}
					/>
    				<RaisedButton label="Submit" primary={true} style={InputStyle} />						
				</Paper>
			</MuiThemeProvider>
		)
	}
}

export default FirstUse