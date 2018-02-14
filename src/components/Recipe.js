import React, { Component } from 'react'
import { List, ListItem, RefreshIndicator, Table, TableBody, TableRow, TableRowColumn, RaisedButton } from 'material-ui'
import { Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {blueGrey900} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900
    }
});

const API = 'https://reciperecommender-survey.ml:3000/'

class Recipe extends Component {
    constructor(props) {
		super(props);
        this.state = {
			recipe: {},
			open: false,
			loading: true
        }
	}

    getItems = () => {
		let recipeReceived = {}
		let recipeId = this.props.match.params.recipeId
        fetch(API + recipeId)
        .then(response => response.json())
        .then(data => {
			recipeReceived = {
				name: data[0].name,
				photo: data[0].images[0].imageUrlsBySize[360],
				ingredients: data[0].ingredientLines,
				source: data[0].source.sourceRecipeUrl,
				nutritions: data[0].nutritionEstimates,
				rating: data[0].rating,
				totalTime: data[0].totalTime,
				nrservings: data[0].numberOfServings,
				calories: data[0].nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL'),
				fatKcal: data[0].nutritionEstimates.find(obj => obj.attribute === 'FAT_KCAL'),
				totalFat: data[0].nutritionEstimates.find(obj => obj.attribute === 'FAT'),
				satFat: data[0].nutritionEstimates.find(obj => obj.attribute === 'FASAT'),
				puFat: data[0].nutritionEstimates.find(obj => obj.attribute === 'FAPU'),
				muFat: data[0].nutritionEstimates.find(obj => obj.attribute === 'FAMS'),
				protein: data[0].nutritionEstimates.find(obj => obj.attribute === 'PROCNT'),
				totalCarb: data[0].nutritionEstimates.find(obj => obj.attribute === 'CHOCDF'),
				dieteryFiber: data[0].nutritionEstimates.find(obj => obj.attribute === 'FIBTG'),
				sugar: data[0].nutritionEstimates.find(obj => obj.attribute === 'SUGAR'),
				cholesterol: data[0].nutritionEstimates.find(obj => obj.attribute === 'CHOLE'),
				potassium: data[0].nutritionEstimates.find(obj => obj.attribute === 'K'),
				vitA: data[0].nutritionEstimates.find(obj => obj.attribute === 'VITA_RAE'),
				vitC: data[0].nutritionEstimates.find(obj => obj.attribute === 'VITC'),
				calcium: data[0].nutritionEstimates.find(obj => obj.attribute === 'CA'),
				iron: data[0].nutritionEstimates.find(obj => obj.attribute === 'FE'),
				_key: data.key
			}
		}).catch((error) => {
			console.log("The read failed: " + error.message)
        }).then(() => {
			console.log(recipeReceived)
			this.setState({
				recipe: recipeReceived,
				loading: false
			});
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
		if (this.state.loading === true) {
			return (
				<MuiThemeProvider muiTheme={muiTheme}>
					<div style={{ position: 'relative' }}>
						<RefreshIndicator
							size={50}
							top={100}
							left={-25}
							status={'loading'}
							style={{marginLeft: '50%'}}
						/>
					</div>
				</MuiThemeProvider>
				)
		} else {
			return (
			 	<MuiThemeProvider muiTheme={muiTheme}>
					<List>
						<p className="container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
							<img src={this.state.recipe.photo} alt=''/>
						</p>
						<ListItem primaryText={this.state.recipe.name} disabled={true} style={{ textAlign: 'center'}}/>
						<ListItem primaryText={<span>{'Total time: '}{this.state.recipe.totalTime ? <span>{this.state.recipe.totalTime}</span> : '-'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{'Servings: '}{this.state.recipe.nrservings ? <span>{this.state.recipe.nrservings}</span> : '-'} </span>}
							disabled={true} style={{ textAlign: 'center' }}/>

						<ListItem primaryText='Ingredients:'
							primaryTogglesNestedList={true}
							nestedItems = {this.state.recipe.ingredients.map((ingr) => (
								<ListItem primaryText={ingr}/>
							))}
						/>
						<RaisedButton label="Read Directions" primary={true} containerElement={<Link to={this.state.recipe.source} target="_blank"/>} style={{width:'100%'}}/>
						<ListItem primaryText='Nutrition:'
							primaryTogglesNestedList={true}
							nestedItems = {[
								<Table>
									<TableBody displayRowCheckbox={false} stripedRows={true}>
										<TableRow>
											<TableRowColumn>Calories</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.calories ? <span>{this.state.recipe.calories.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.calories ? <span>{this.state.recipe.calories.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Calories from fat</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.fatKcal ? <span>{this.state.recipe.fatKcal.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.fatKcal ? <span>{this.state.recipe.fatKcal.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Total Fat</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.totalFat ? <span>{this.state.recipe.totalFat.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.totalFat ? <span>{this.state.recipe.totalFat.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Saturated Fat</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.satFat ? <span>{this.state.recipe.satFat.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.satFat ? <span>{this.state.recipe.satFat.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trans Fat</TableRowColumn>
											<TableRowColumn>{(parseFloat(this.state.recipe.totalFat ? this.state.recipe.totalFat.value : 0) - (parseFloat(this.state.recipe.satFat ? this.state.recipe.satFat.value : 0) 
													+ parseFloat(this.state.recipe.puFat ? this.state.recipe.puFat.value : 0) + parseFloat(this.state.recipe.muFat ? this.state.recipe.muFat.value : 0))).toFixed(2)}
											</TableRowColumn>
											<TableRowColumn><span>{this.state.recipe.satFat ? <span>{this.state.recipe.satFat.unit.abbreviation}</span> : '-'}</span></TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Protein</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.protein ? <span>{this.state.recipe.protein.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.protein ? <span>{this.state.recipe.protein.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Total Carbohydrate</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.totalCarb ? <span>{this.state.recipe.totalCarb.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.totalCarb ? <span>{this.state.recipe.totalCarb.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dietary Fiber</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.dieteryFiber ? <span>{this.state.recipe.dieteryFiber.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.dieteryFiber ? <span>{this.state.recipe.dieteryFiber.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sugars</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.sugar ? <span>{this.state.recipe.sugar.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.sugar ? <span>{this.state.recipe.sugar.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Cholesterol</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.cholesterol ? <span>{this.state.recipe.cholesterol.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.cholesterol ? <span>{this.state.recipe.cholesterol.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Potassium</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.potassium ? <span>{this.state.recipe.potassium.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.potassium ? <span>{this.state.recipe.potassium.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Vitamin A</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.vitA ? <span>{this.state.recipe.vitA.value }</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.vitA ? <span>{this.state.recipe.vitA.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Vitamin C</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.vitC ? <span>{this.state.recipe.vitC.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.vitC ? <span>{this.state.recipe.vitC.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Calcium</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.calcium ? <span>{this.state.recipe.calcium.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.calcium ? <span>{this.state.recipe.calcium.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>Iron</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.iron ? <span>{this.state.recipe.iron.value}</span> : '-'}</span>}</TableRowColumn>
											<TableRowColumn>{<span>{this.state.recipe.iron ? <span>{this.state.recipe.iron.unit.abbreviation}</span> : '-'}</span>}</TableRowColumn>
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
}

export default Recipe;