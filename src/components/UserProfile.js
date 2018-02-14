import React, { Component } from 'react'
import { RefreshIndicator, Table, TableBody, TableRow, TableRowColumn, GridList, Subheader, GridTile } from 'material-ui'
import { app } from '../base'
import { Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {blueGrey900} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900
    }
});

const API = 'https://reciperecommender-survey.ml:3000/short/'

class DietPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.location.state._id,
            breakfast: [],
            lunch: [],
            soup: [],
            mainDish: [],
            dessert: [],
            calorie: null,
            cholesterol: null,
            sodium: null,
            potassium: null,
            fat: null,
            satFat: null,
            protein: null,
            carbs: null,
            sugars: null,
            dietary: null,
            loading: true
        }
    }

    getDietPlan = () => {
        let breakfast = []
        let lunch = []
        let soup = []
        let mainDish = []
        let dessert = []
        let calorie = null
        let cholesterol = null
        let sodium = null
        let potassium = null
        let fat = null
        let satFat = null
        let protein = null
        let carbs = null
        let sugars = null
        let dietary = null
        let _id = this.state._id
        let query = app.database().ref(`users/${_id}/dietPlan`).limitToLast(1)
        query.once('value', function(snapshot) {
            snapshot.forEach(function(child) {
                breakfast = child.val().breakfast
                lunch = child.val().lunch
                soup = child.val().soup
                mainDish = child.val().mainDish
                dessert = child.val().dessert
                calorie = child.val().calorie
                cholesterol = child.val().cholesterol
                sodium = child.val().sodium
                potassium = child.val().potassium
                fat = child.val().fat
                satFat = child.val().satFat
                protein = child.val().protein
                carbs = child.val().carbs
                sugars = child.val().sugars
                dietary = child.val().dietary
            });
        }).then(() => {
            if (typeof breakfast !== 'undefined') {
                for (var i=0, n=breakfast.length; i < n; i++ ) {
                    fetch(API + breakfast[i])
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            breakfast: data,
                        })
                    })
                }
            }
            if (typeof lunch !== 'undefined') {
                for (var k=0, l=lunch.length; k < l; k++ ) {
                    fetch(API + lunch[k])
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            lunch: data,
                        })
                    })
                }
            }
            if (typeof soup !== 'undefined') {
                for (var m=0, j=soup.length; m < j; m++ ) {
                    fetch(API + soup[m])
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            soup: data,
                        })
                    })
                }
            }
            if (typeof mainDish !== 'undefined') {
                for (var q=0, w=mainDish.length; q < w; q++ ) {
                    fetch(API + mainDish[q])
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            mainDish: data,
                        })
                    })
                }
            }
            if (typeof dessert !== 'undefined') {
                for (var r=0, t=dessert.length; r < t; r++ ) {
                    fetch(API + dessert[r])
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            dessert: data,
                        })
                    })
                }
            }
            this.setState({
                loading: false,
                calorie: calorie,
                cholesterol: cholesterol,
                sodium: sodium,
                potassium: potassium,
                fat: fat,
                satFat: satFat,
                protein: protein,
                carbs: carbs,
                sugars: sugars,
                dietary: dietary,
            })
        })
    }

    componentDidMount = () => {
    	this.getDietPlan();
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
                    <div>
                        <GridList
                            cellHeight='auto'
                            style={{justifyContent: 'center'}}
                            >
                            {this.state.breakfast.length > 0    
                            ?<Subheader style={{textAlign: 'center', fontSize: '40px'}}>Breakfast</Subheader>
                            :<Subheader></Subheader>}
                            {this.state.breakfast.map((tile) => (
                                <GridTile
                                key={tile.key}
                                title={tile.name}
                                containerElement={<Link to={`/recipe/${tile.key}`}/>}
                                >
                                <img src={tile.images[0].imageUrlsBySize[360]} alt=''/>
                                </GridTile>
                            ))}
                        </GridList>
                        <GridList
                            cellHeight='auto'
                            style={{justifyContent: 'center'}}
                            >
                            {this.state.lunch.length > 0    
                            ?<Subheader style={{textAlign: 'center', fontSize: '40px'}}>Lunch</Subheader>
                            :<Subheader></Subheader>}
                            {this.state.lunch.map((tile) => (
                                <GridTile
                                key={tile.key}
                                title={tile.name}
                                containerElement={<Link to={`/recipe/${tile.key}`}/>}
                                >
                                <img src={tile.images[0].imageUrlsBySize[360]} alt=''/>
                                </GridTile>
                            ))}
                        </GridList>
                        <GridList
                            cellHeight='auto'
                            style={{justifyContent: 'center'}}
                            >
                            {this.state.soup.length > 0    
                            ?<Subheader style={{textAlign: 'center', fontSize: '40px'}}>Soup</Subheader>
                            :<Subheader></Subheader>}
                            {this.state.soup.map((tile) => (
                                <GridTile
                                key={tile.key}
                                title={tile.name}
                                containerElement={<Link to={`/recipe/${tile.key}`}/>}
                                >
                                <img src={tile.images[0].imageUrlsBySize[360]} alt=''/>
                                </GridTile>
                            ))}
                        </GridList>
                        <GridList
                            cellHeight='auto'
                            style={{justifyContent: 'center'}}
                            >
                            {this.state.mainDish.length > 0  
                            ?<Subheader style={{textAlign: 'center', fontSize: '40px'}}>Main Dish</Subheader>
                            :<Subheader></Subheader>}
                            {this.state.mainDish.map((tile) => (
                                <GridTile
                                key={tile.key}
                                title={tile.name}
                                containerElement={<Link to={`/recipe/${tile.key}`}/>}
                                >
                                <img src={tile.images[0].imageUrlsBySize[360]} alt=''/>
                                </GridTile>
                            ))}
                        </GridList>
                        <GridList
                            cellHeight='auto'
                            style={{justifyContent: 'center'}}
                            >
                            {this.state.dessert.length > 0    
                            ?<Subheader style={{textAlign: 'center', fontSize: '40px'}}>Dessert</Subheader>
                            :<Subheader></Subheader>}
                            {this.state.dessert.map((tile) => (
                                <GridTile
                                key={tile.key}
                                title={tile.name}
                                containerElement={<Link to={`/recipe/${tile.key}`}/>}
                                >
                                <img src={tile.images[0].imageUrlsBySize[360]} alt=''/>
                                </GridTile>
                            ))}
                        </GridList>
                        <Table selectable={false}>
                            <TableBody displayRowCheckbox={false}>
                                <TableRow>
                                    <TableRowColumn>Calories</TableRowColumn>
                                    <TableRowColumn>{this.state.calorie}</TableRowColumn>
                                    <TableRowColumn>Cholesterol</TableRowColumn>
                                    <TableRowColumn>{this.state.cholesterol}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Fat</TableRowColumn>
                                    <TableRowColumn>{this.state.fat}</TableRowColumn>
                                    <TableRowColumn>Saturated fat:</TableRowColumn>
                                    <TableRowColumn>{this.state.satFat}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Sodium</TableRowColumn>
                                    <TableRowColumn>{this.state.sodium}</TableRowColumn>
                                    <TableRowColumn>Potassium</TableRowColumn>
                                    <TableRowColumn>{this.state.potassium}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Protein</TableRowColumn>
                                    <TableRowColumn>{this.state.protein}</TableRowColumn>
                                    <TableRowColumn>Total carbs</TableRowColumn>
                                    <TableRowColumn>{this.state.carbs}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Sugars</TableRowColumn>
                                    <TableRowColumn>{this.state.sugars}</TableRowColumn>
                                    <TableRowColumn>Dietary fiber</TableRowColumn>
                                    <TableRowColumn>{this.state.dietary}</TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </MuiThemeProvider>
            )
        }
    }
}

export default DietPlan;