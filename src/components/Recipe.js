import React, { Component } from 'react'
import { GridList, GridTile, List, ListItem, nestedItems, RefreshIndicator } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import Subheader from 'material-ui/Subheader'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'

class GridListExampleSimple extends Component {
    constructor(props) {
		super(props);
        this.state = {
			recipe: {},
        }
    }

    getItems = () => {
		var recipeReceived = {}
		let recipeId = this.props.match.params.recipeId
        let ref = app.database().ref();
        ref.once('value', function(snapshot) {
        	snapshot.forEach(function(child) {
				if (child.key == recipeId) {
					recipeReceived = {
						name: child.val().name,
						photo: child.val().images[0].hostedLargeUrl,
						attributes: child.val().attributes,
						flavors: child.val().flavors,
						ingredients: child.val().ingredientLines,
						source: child.val().source.sourceRecipeUrl,
						nutritions: child.val().nutritionEstimates,
						rating: child.val().rating,
						totalTime: child.val().totalTime,
						nrservings: child.val().numberOfServings,
						_key: child.key
					};
				}
          	});
        }).catch((error) => {
            console.log("The read failed: " + error.message);
        }).then(() => {
            this.setState({recipe: recipeReceived});
        }); 
      }
    
	componentDidMount = () => {
		this.getItems();
	}
    
    render() {
		return  (Object.keys(this.state.recipe).length === 0 && this.state.recipe.constructor === Object)
			? (<MuiThemeProvider>
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
			</ MuiThemeProvider>)
			: (<MuiThemeProvider>
				<List>
					<p class="container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
						<img src={this.state.recipe.photo}/>
					</p>
					<ListItem primaryText={this.state.recipe.name} style={{ textAlign: 'center'}}/>
					<ListItem primaryText={
						`Total time: ${this.state.recipe.totalTime} Servings: ${this.state.recipe.nrservings}`}
						style={{ textAlign: 'center'}}/>
					<ListItem primaryText='Ingredients:'
						primaryTogglesNestedList={true}
						nestedItems = {this.state.recipe.ingredients.map((ingr) => (
							<ListItem primaryText={ingr}/>
						))}
					/>
					<ListItem primaryText='Nutrition:' 
						nestedItems = {this.state.recipe.nutritions.map((nutr) => (
							<ListItem primaryText={nutr}/>
						))}
					/>
				</ List>
			</ MuiThemeProvider>
		)
	}    
}

export default GridListExampleSimple;