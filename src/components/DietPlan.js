import React, { Component } from 'react'
import { AppBar, Card, CardTitle, CardMedia, CardActions, RefreshIndicator, RaisedButton, FloatingActionButton, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { app } from '../base'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {blueGrey900, green500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900,
    }
});

const buttonStyle = {
    width: '30%',
    marginLeft: '35%',
    marginTop: '15%'
}

const footerStyle = {
    backgroundColor: "#263238",
    fontSize: "20px",
    color: "white",
    textAlign: "center",
    padding: "10px",
    position: "fixed",
    bottom: "0",
    left: "0",
    height: "100px",
    width: "auto%"
  };
  
const phantomStyle = {
    display: "block",
    padding: "20px",
    height: "60px",
    width: "auto%"
  };
  
function Footer({ children }) {
    return (
      <div>
        <div style={phantomStyle} />
        <div style={footerStyle}>{children}</div>
      </div>
    );
  }
  

const API = 'https://reciperecommender-survey.ml:5000/similarecipes/'

class DietPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generated: false,
            loading: false,
            userEmail: this.props.location.state.userEmail,
            gender: null,
            dietType: null,
            calorieIntake: 0,
            breakfasts: [],
            lunches: [],
            soups: [],
            mainDishes: [],
            desserts: [], 
            currentCalorie: 0,
            currentFat: 0,
            currentProtein: 0,
            currentCarbs: 0,
            breakfastChosen: [],
            lunchChosen: [],
            soupChosen: [],
            mainDishChosen: [],
            dessertChosen: [],
            submit: false,
            chosenBr: [false, false, false, false],
            chosenLu: [false, false, false, false],
            chosenSou: [false, false, false, false],
            chosenMa: [false, false, false, false],
            chosenDe: [false, false, false, false]
        }
        this.getUser = this.getUser.bind(this)
        this.getDietPlan = this.getDietPlan.bind(this)
        this.addBreakfast = this.addBreakfast.bind(this)
        this.addLunch = this.addLunch.bind(this)
        this.addSoup = this.addSoup.bind(this)
        this.addMainDish = this.addMainDish.bind(this)
        this.addDessert = this.addDessert.bind(this)
    }

    getUser = () => {
        let userReceived = {}
        let email = this.state.userEmail
        let query = app.database().ref('users').orderByChild('email').equalTo(email)
        query.once('value', function(snapshot) {
            snapshot.forEach(function(child) {
                userReceived['gen'] = child.val().gender,
                userReceived['diet'] = child.val().dietType,
                userReceived['calorie'] = child.val().calorieIntake
            });
        }).then(() => {
            this.setState({
                gender: userReceived.gen,
                dietType: userReceived.diet,
                calorieIntake: userReceived.calorie,
                loading: true
            })
            this.getDietPlan(this.state.userEmail)
        })
    }

    getDietPlan = (email) => {
        let recipesReceived = {}
        fetch(API + email)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({
                breakfasts: data[0],
                lunches: data[1],
                soups: data[2],
                mainDishes: data[3],
                desserts: data[4],
                loading: false,
                generated: true
            })
        })
    }

    addBreakfast = (idx, itemKey, itemCalorie, itemFat, itemProtein, itemCarbs) => {
        let added = []
        added = this.state.chosenBr
        added[idx] = !(this.state.chosenBr[idx])
        if (added[idx] === true) {
            let breakfastChosenTemp = this.state.breakfastChosen.slice()
            breakfastChosenTemp.push(itemKey)
            this.setState({
                chosenBr: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentFat: this.state.currentFat + itemFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                breakfastChosen: breakfastChosenTemp
            })
        } else {
            let breakfastChosenTemp = this.state.breakfastChosen.slice()
            let i = breakfastChosenTemp.indexOf(itemKey);
            if(i !== -1) {
                breakfastChosenTemp.splice(i, 1);
            }
            this.setState({
                chosenBr: added,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentFat: this.state.currentFat - itemFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                breakfastChosen: breakfastChosenTemp
            })
        }
    }

    addLunch = (idx, itemKey, itemCalorie, itemFat, itemProtein, itemCarbs) => {
        let added = []
        added = this.state.chosenLu
        added[idx] = !(this.state.chosenLu[idx])
        if (added[idx] === true) {
            let lunchChosenTemp = this.state.lunchChosen.slice()
            lunchChosenTemp.push(itemKey)
            this.setState({
                chosenLu: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentFat: this.state.currentFat + itemFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                lunchChosen: lunchChosenTemp
            })
        } else {
            let lunchChosenTemp = this.state.lunchChosen.slice()
            let i = lunchChosenTemp.indexOf(itemKey);
            if(i !== -1) {
                lunchChosenTemp.splice(i, 1);
            }
            this.setState({
                chosenLu: added,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentFat: this.state.currentFat - itemFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                lunchChosen: lunchChosenTemp
            })
        }
    }

    addSoup = (idx, itemKey, itemCalorie, itemFat, itemProtein, itemCarbs) => {
        let added = []
        added = this.state.chosenSou
        added[idx] = !(this.state.chosenSou[idx])
        if (added[idx] === true) {
            let soupChosenTemp = this.state.soupChosen.slice()
            soupChosenTemp.push(itemKey)
            this.setState({
                chosenSou: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentFat: this.state.currentFat + itemFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                soupChosen: soupChosenTemp
            })
        } else {
            let soupChosenTemp = this.state.soupChosen.slice()
            let i = soupChosenTemp.indexOf(itemKey);
            if(i !== -1) {
                soupChosenTemp.splice(i, 1);
            }
            this.setState({
                chosenSou: added,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentFat: this.state.currentFat - itemFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                soupChosen: soupChosenTemp
            })
        }
    }

    addMainDish = (idx, itemKey, itemCalorie, itemFat, itemProtein, itemCarbs) => {
        let added = []
        added = this.state.chosenMa
        added[idx] = !(this.state.chosenMa[idx])
        if (added[idx] === true) {
            let mainDishChosenTemp = this.state.mainDishChosen.slice()
            mainDishChosenTemp.push(itemKey)
            this.setState({
                chosenMa: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentFat: this.state.currentFat + itemFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                mainDishChosen: mainDishChosenTemp
            })
        } else {
            let mainDishChosenTemp = this.state.mainDishChosen.slice()
            let i = mainDishChosenTemp.indexOf(itemKey);
            if(i !== -1) {
                mainDishChosenTemp.splice(i, 1);
            }
            this.setState({
                chosenMa: added,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentFat: this.state.currentFat - itemFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                mainDishChosen: mainDishChosenTemp
            })
        }
    }

    addDessert = (idx, itemKey, itemCalorie, itemFat, itemProtein, itemCarbs) => {
        let added = []
        added = this.state.chosenDe
        added[idx] = !(this.state.chosenDe[idx])
        if (added[idx] === true) {
            let dessertChosenTemp = this.state.dessertChosen.slice()
            dessertChosenTemp.push(itemKey)
            this.setState({
                chosenDe: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentFat: this.state.currentFat + itemFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                dessertChosen: dessertChosenTemp
            })
        } else {
            let dessertChosenTemp = this.state.dessertChosen.slice()
            let i = dessertChosenTemp.indexOf(itemKey);
            if(i !== -1) {
                dessertChosenTemp.splice(i, 1);
            }
            this.setState({
                chosenDe: added,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentCalorie: this.state.currentCalorie - itemCalorie,
                currentFat: this.state.currentFat - itemFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                dessertChosen: dessertChosenTemp
            })
        }
    }

    submit = () => {
        /*app.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).push({
            breakfast: this.state.breakfastChosen,
            lunch: this.state.lunchChosen,
            soup: this.state.soupChosen,
            maindish: this.state.maindishChosen,
            dessert: this.state.dessertChosen
        })
        this.props.history.push('/dietplan', {userEmail: this.state.userEmail})*/
        console.log('hura')
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
            if (this.state.generated === false) {
                return (
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <RaisedButton label='GENERATE DIET PLAN' primary={true} onClick={this.getUser} style={buttonStyle} disabled={false}/>
                    </ MuiThemeProvider>
                )
            } else {
                return (
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <div>
                            <AppBar
                                title='Breakfast'
                                showMenuIconButton={false}
                                style={{textAlign: 'center'}}
                            />
                            {this.state.breakfasts.map((tile, index) => (
                            <Card style={{width:'50%', display: 'inline-block', padding: '10px'}}>
                                <CardMedia
                                    overlay={<CardTitle title={tile.name}/>}
                                    >
                                    <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                                </CardMedia>
                                <CardActions>
                                    <Table selectable={false}>
                                        <TableBody displayRowCheckbox={false}>
                                            <TableRow>
                                                <TableRowColumn>Calories</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenBr[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addBreakfast(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addBreakfast(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>}
                                </CardActions>
                            </Card>
                            ))}
                            <AppBar
                                title='Lunch'
                                showMenuIconButton={false}
                                style={{textAlign: 'center'}}
                            />
                            {this.state.lunches.map((tile, index) => (
                            <Card style={{width:'50%', display: 'inline-block', padding: '10px'}}>
                                <CardMedia
                                    overlay={<CardTitle title={tile.name}/>}
                                    >
                                    <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                                </CardMedia>
                                <CardActions>
                                    <Table selectable={false}>
                                        <TableBody displayRowCheckbox={false}>
                                            <TableRow>
                                                <TableRowColumn>Calories</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenLu[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addLunch(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addLunch(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>}
                                </CardActions>
                            </Card>
                            ))}
                            <AppBar
                                title='Soup'
                                showMenuIconButton={false}
                                style={{textAlign: 'center'}}
                            />
                            {this.state.soups.map((tile, index) => (
                            <Card style={{width:'50%', display: 'inline-block', padding: '10px'}}>
                                <CardMedia
                                    overlay={<CardTitle title={tile.name}/>}
                                    >
                                    <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                                </CardMedia>
                                <CardActions>
                                    <Table selectable={false}>
                                        <TableBody displayRowCheckbox={false}>
                                            <TableRow>
                                                <TableRowColumn>Calories</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenSou[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addSoup(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addSoup(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>}
                                </CardActions>
                            </Card>
                            ))}
                            <AppBar
                                title='Main Dish'
                                showMenuIconButton={false}
                                style={{textAlign: 'center'}}
                            />
                            {this.state.mainDishes.map((tile, index) => (
                            <Card style={{width:'50%', display: 'inline-block', padding: '10px'}}>
                                <CardMedia
                                    overlay={<CardTitle title={tile.name}/>}
                                    >
                                    <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                                </CardMedia>
                                <CardActions>
                                    <Table selectable={false}>
                                        <TableBody displayRowCheckbox={false}>
                                            <TableRow>
                                                <TableRowColumn>Calories</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenMa[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addMainDish(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addMainDish(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>}
                                </CardActions>
                            </Card>
                            ))}
                            <AppBar
                                title='Dessert'
                                showMenuIconButton={false}
                                style={{textAlign: 'center'}}
                            />
                            {this.state.desserts.map((tile, index) => (
                            <Card style={{width:'50%', display: 'inline-block', padding: '10px'}}>
                                <CardMedia
                                    overlay={<CardTitle title={tile.name}/>}
                                    >
                                    <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                                </CardMedia>
                                <CardActions>
                                    <Table selectable={false}>
                                        <TableBody displayRowCheckbox={false}>
                                            <TableRow>
                                                <TableRowColumn>Calories</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenDe[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addDessert(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addDessert(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10), 
                                                            parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10))}}> 
                                        <ContentAdd />
                                    </FloatingActionButton>}
                                </CardActions>
                            </Card>
                            ))}
                            {this.state.breakfastChosen.length > 0 || this.state.lunchChosen.length > 0 || this.state.soupChosen.length > 0 || this.state.mainDishChosen.length > 0 || this.state.dessertChosen.length > 0
                            ? <RaisedButton label='SUBMIT' primary={true} onClick={this.submit} fullWidth={true} disabled={false}/> 
                            : <RaisedButton label='SUBMIT' primary={true} onClick={this.submit} fullWidth={true} disabled={true}/>}
                            <Footer>
                                <Table selectable={false}>
                                    <TableBody displayRowCheckbox={false}>
                                        <TableRow>
                                            <TableRowColumn>Calorie limit:  {this.state.calorieIntake}</TableRowColumn>
                                            <TableRowColumn>Calorie: {this.state.currentCalorie}</TableRowColumn>
                                            <TableRowColumn>Fat limit:</TableRowColumn>
                                            <TableRowColumn>Fat: {this.state.currentFat}</TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn>Protein limit:</TableRowColumn>
                                            <TableRowColumn>Protein: {this.state.currentProtein}</TableRowColumn>
                                            <TableRowColumn>Carbs limit:</TableRowColumn>
                                            <TableRowColumn>Carbs {this.state.currentCarbs}</TableRowColumn>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Footer>
                        </div>
                    </ MuiThemeProvider>
                )
            }
        }
    }
}

export default DietPlan;