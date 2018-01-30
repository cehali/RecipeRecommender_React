import React, { Component, Image } from 'react'
import { List, ListItem, nestedItems, RefreshIndicator, Table, TableBody, TableRow, TableRowColumn, RaisedButton, FlatButton, Dialog } from 'material-ui'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { push, Redirect } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'
import FullscreenDialog from 'material-ui-fullscreen-dialog'

const customContentStyle = {
	width: '100%',
	maxWidth: 'none',
  };

class Recipe extends Component {
    constructor(props) {
		super(props);
        this.state = {
			recipe: {},
			open: false
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
						photo: child.val().images[0].imageUrlsBySize[360],
						ingredients: child.val().ingredientLines,
						source: child.val().source.sourceRecipeUrl,
						nutritions: child.val().nutritionEstimates,
						rating: child.val().rating,
						totalTime: child.val().totalTime,
						nrservings: child.val().numberOfServings,
						calories: child.val().nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL'),
						fatKcal: child.val().nutritionEstimates.find(obj => obj.attribute === 'FAT_KCAL'),
						totalFat: child.val().nutritionEstimates.find(obj => obj.attribute === 'FAT'),
						satFat: child.val().nutritionEstimates.find(obj => obj.attribute === 'FASAT'),
						puFat: child.val().nutritionEstimates.find(obj => obj.attribute === 'FAPU'),
						muFat: child.val().nutritionEstimates.find(obj => obj.attribute === 'FAMS'),
						protein: child.val().nutritionEstimates.find(obj => obj.attribute === 'PROCNT'),
						totalCarb: child.val().nutritionEstimates.find(obj => obj.attribute === 'CHOCDF'),
						dieteryFiber: child.val().nutritionEstimates.find(obj => obj.attribute === 'FIBTG'),
						sugar: child.val().nutritionEstimates.find(obj => obj.attribute === 'SUGAR'),
						cholesterol: child.val().nutritionEstimates.find(obj => obj.attribute === 'CHOLE'),
						potassium: child.val().nutritionEstimates.find(obj => obj.attribute === 'K'),
						vitA: child.val().nutritionEstimates.find(obj => obj.attribute === 'VITA_RAE'),
						vitC: child.val().nutritionEstimates.find(obj => obj.attribute === 'VITC'),
						calcium: child.val().nutritionEstimates.find(obj => obj.attribute === 'CA'),
						iron: child.val().nutritionEstimates.find(obj => obj.attribute === 'CA'),

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

	handleOpen = () => {
		this.setState({open: true});
	}

	handleClose = () => {
		this.setState({open: false});
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
			</MuiThemeProvider>)
			: (<MuiThemeProvider>
				<List>
					<p className="container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
						<img src={this.state.recipe.photo} alt=''/>
					</p>
					<ListItem primaryText={this.state.recipe.name} disabled={true} style={{ textAlign: 'center'}}/>
					<ListItem primaryText={
						`Total time: ${this.state.recipe.totalTime} Servings: ${this.state.recipe.nrservings}`} disabled={true}
						style={{ textAlign: 'center'}}/>
					<ListItem primaryText='Ingredients:'
						primaryTogglesNestedList={true}
						nestedItems = {this.state.recipe.ingredients.map((ingr) => (
							<ListItem primaryText={ingr}/>
						))}
					/>
					<RaisedButton label="Read Directions" primary={true} onClick={this.handleOpen} style={{width:'100%'}}/>
						<FullscreenDialog
							open={this.state.open}						
							actionButton={<FlatButton
								label='Done'
								onClick={this.handleClose}
							/>}
						>
						<div style={{margin:'0px', padding:'0px', overflow:'hidden'}}>
							<iframe src={this.state.recipe.source} frameborder="0" style={{overflow:'hidden', height:'100%', width:'100%', position:'absolute', top:'0px', left:'0px', right:'0px', bottom:'0px'}} height="100%" width="100%"></iframe>
						</div>
					</FullscreenDialog>
					<ListItem primaryText='Nutrition:'
						primaryTogglesNestedList={true}
						nestedItems = {[
							<Table>
								<TableBody displayRowCheckbox={false} stripedRows={true}>
									<TableRow>
										<TableRowColumn>Calories</TableRowColumn>
										<TableRowColumn>{this.state.recipe.calories.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.calories.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Calories from fat</TableRowColumn>
										<TableRowColumn>{this.state.recipe.fatKcal.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.fatKcal.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Total Fat</TableRowColumn>
										<TableRowColumn>{this.state.recipe.totalFat.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.totalFat.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Saturated Fat</TableRowColumn>
										<TableRowColumn>{this.state.recipe.satFat.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.satFat.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Trans Fat</TableRowColumn>
										<TableRowColumn>{
											(parseFloat(this.state.recipe.totalFat.value) - (parseFloat(this.state.recipe.satFat.value) + parseFloat(this.state.recipe.puFat.value) + parseFloat(this.state.recipe.muFat.value))).toFixed(2)
										}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.satFat.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Protein</TableRowColumn>
										<TableRowColumn>{this.state.recipe.protein.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.protein.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Total Carbohydrate</TableRowColumn>
										<TableRowColumn>{this.state.recipe.totalCarb.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.totalCarb.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Dietary Fiber</TableRowColumn>
										<TableRowColumn>{this.state.recipe.dieteryFiber.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.dieteryFiber.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Sugars</TableRowColumn>
										<TableRowColumn>{this.state.recipe.sugar.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.sugar.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Cholesterol</TableRowColumn>
										<TableRowColumn>{this.state.recipe.cholesterol.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.cholesterol.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Potassium</TableRowColumn>
										<TableRowColumn>{this.state.recipe.potassium.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.potassium.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Vitamin A</TableRowColumn>
										<TableRowColumn>{this.state.recipe.vitA.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.vitA.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Vitamin C</TableRowColumn>
										<TableRowColumn>{this.state.recipe.vitC.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.vitC.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Calcium</TableRowColumn>
										<TableRowColumn>{this.state.recipe.calcium.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.calcium.unit.abbreviation}</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>Iron</TableRowColumn>
										<TableRowColumn>{this.state.recipe.iron.value}</TableRowColumn>
										<TableRowColumn>{this.state.recipe.iron.unit.abbreviation}</TableRowColumn>
									</TableRow>
								</TableBody>
						  	</Table>
						]}
					/>
				</List>
			</MuiThemeProvider>
		)
	}    
}

export default Recipe;