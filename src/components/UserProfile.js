import React, { Component } from 'react'
import { Card, CardHeader, CardTitle, CardMedia, RefreshIndicator, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
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
            fat: null,
            protein: null,
            carbs: null,
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
        let fat = null
        let protein = null
        let carbs = null
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
                fat = child.val().fat
                protein = child.val().protein
                carbs = child.val().carbs
            });
        }).then(() => {
            for (var i=0, n=breakfast.length; i < n; i++ ) {
                fetch(API + breakfast[i])
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        breakfast: data,
                    })
                })
            }
            for (var k=0, l=lunch.length; k < l; k++ ) {
                fetch(API + lunch[k])
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        lunch: data,
                    })
                })
            }
            for (var m=0, j=soup.length; m < j; m++ ) {
                fetch(API + soup[m])
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        soup: data,
                    })
                })
            }
            for (var q=0, w=mainDish.length; q < w; q++ ) {
                fetch(API + mainDish[q])
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        mainDish: data,
                    })
                })
            }
            for (var r=0, t=dessert.length; r < t; r++ ) {
                fetch(API + dessert[r])
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        dessert: data,
                    })
                })
            }
            this.setState({
                loading: false,
                calorie: calorie,
                fat: fat,
                protein: protein,
                carbs: carbs,
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
                    <div style={{position: 'relative'}}>
                        {this.state.breakfast.map((tile, index) => (
                        <Card style={{width:'50%', padding: '10px'}}>
                                <CardHeader
                                    title='Breakfast'
                                    style={{textAlign: 'center'}}
                                />
                            <CardMedia overlay={<CardTitle title={tile.name}/>}>
                                <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                            </CardMedia>
                        </Card>
                        ))}               
                        {this.state.lunch.map((tile, index) => (
                        <Card style={{width:'50%', padding: '10px'}}>
                                <CardHeader
                                    title='Lunch'
                                    style={{textAlign: 'center'}}
                                />
                            <CardMedia overlay={<CardTitle title={tile.name}/>}>
                                <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                            </CardMedia>
                        </Card>
                        ))}               
                        {this.state.soup.map((tile, index) => (
                        <Card style={{width:'50%', padding: '10px'}}>
                            <CardHeader
                                    title='Soup'
                                    style={{textAlign: 'center'}}
                                />
                            <CardMedia overlay={<CardTitle title={tile.name}/>}>
                                <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                            </CardMedia>
                        </Card>
                        ))}               
                        {this.state.mainDish.map((tile, index) => (
                        <Card style={{width:'50%', padding: '10px'}}>
                            <CardHeader
                                    title='Main Dish'
                                    style={{textAlign: 'center'}}
                                />
                            <CardMedia overlay={<CardTitle title={tile.name}/>}>
                                <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                            </CardMedia>
                        </Card>
                        ))}
                        {this.state.dessert.map((tile, index) => (
                        <Card style={{width:'50%', padding: '10px'}}>
                            <CardHeader
                                    title='Dessert'
                                    style={{textAlign: 'center'}}
                                />
                            <CardMedia overlay={<CardTitle title={tile.name}/>} >
                                <a href={`/recipe/${tile.key}`}/>
                                <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                            </CardMedia>
                        </Card>
                        ))}
                        <Table selectable={false}>
                            <TableBody displayRowCheckbox={false}>
                                <TableRow>
                                    <TableRowColumn>Calories</TableRowColumn>
                                    <TableRowColumn>{this.state.calorie}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Fat</TableRowColumn>
                                    <TableRowColumn>{this.state.fat}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Protein</TableRowColumn>
                                    <TableRowColumn>{this.state.protein}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn>Carbs</TableRowColumn>
                                    <TableRowColumn>{this.state.carbs}</TableRowColumn>
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