import React, { Component } from 'react'
import { app } from '../base'
import { RefreshIndicator, AutoComplete } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recipes: [],
			dataSource: []
		}
		this.showFoundedRecipe = this.showFoundedRecipe.bind(this)
		this.getDataSource = this.getDataSource.bind(this)
	}

	getItems = () => {
		var recipesReceived = []
		let ref = app.database().ref();
		ref.once('value', function(snapshot) {
			snapshot.forEach(function(child) {
				recipesReceived.push({
					name: child.val().name,
					dishType: child.val().attributes.course,
					_key: child.key
				});
			});
		}).catch((error) => {
			console.log("The read failed: " + error.message);
		}).then(() => {
			this.setState({recipes: recipesReceived});
		}); 
	}
	
	componentDidMount = () => {
		this.getItems();
	}

	getDataSource = (obj) => {
		var names = []
		Object.keys(obj).forEach(function(key) {
			var val = obj[key]['name'];
			names.push(val);
		})
		return names
	}

	showFoundedRecipe = (nm, idx) => {
		this.props.history.push(`/recipes/${this.state.recipes[idx]._key}`)
	}

	render() {
		return (
			Object.keys(this.state.recipes).length === 0 && this.state.recipes.constructor === Object
			?<MuiThemeProvider>
				<div style={{ textAlign: 'center', position: 'absolute', top: '25%', left: '50%'}}>
					<h3>Loading</h3>
					<RefreshIndicator
						size={50}
						status="loading"
						left={0}
						top={0}
						style={{display: 'inline-block', position: 'relative'}}
					/>
				</div>
			</MuiThemeProvider>
			:<MuiThemeProvider>
				<AutoComplete
					floatingLabelText="Search Recipe"
					filter={AutoComplete.caseInsensitiveFilter}
					dataSource={this.getDataSource(this.state.recipes)}
					fullWidth={true}
					onNewRequest={this.showFoundedRecipe}>
				</AutoComplete>
			</MuiThemeProvider> 
		)
	}
}

export default Search