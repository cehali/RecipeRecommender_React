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
    padding: "5px",
    position: "fixed",
    bottom: "0",
    left: "0",
    height: "200px",
    width: "auto%"
  };
  
const phantomStyle = {
    display: "block",
    padding: "5px",
    height: "200px",
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
            loading: true,
            gender: null,
            userEmail: this.props.location.state.userEmail,
            calorieIntake: 0,
            nutrientLimits: [],
            breakfasts: [],
            lunches: [],
            soups: [],
            mainDishes: [],
            desserts: [], 
            currentCalorie: 0,
            currentCholesterol: 0,
            currentSodium: 0,
            currentPotassium: 0,
            currentFat: 0,
            currentsatFat: 0,
            currentProtein: 0,
            currentCarbs: 0,
            currentSugars: 0,
            currentDietary: 0,
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
            chosenDe: [false, false, false, false],
            _id: null
        }
        this.getUser = this.getUser.bind(this)
        this.getDietPlan = this.getDietPlan.bind(this)
        this.addBreakfast = this.addBreakfast.bind(this)
        this.addLunch = this.addLunch.bind(this)
        this.addSoup = this.addSoup.bind(this)
        this.addMainDish = this.addMainDish.bind(this)
        this.addDessert = this.addDessert.bind(this)
        this.showDietPlan = this.showDietPlan.bind(this)
    }

    getUser = () => {
        let userReceived = {}
        let _id = null
        let email = this.state.userEmail
        let query = app.database().ref('users').orderByChild('email').equalTo(email)
        query.once('value', function(snapshot) {
            snapshot.forEach(function(child) {
                userReceived['gen'] = child.val().gender
                userReceived['calorie'] = child.val().calorieIntake
                _id = child.key
            });
        }).then(() => {
            this.setState({
                gender: userReceived.gen,
                dietType: userReceived.diet,
                calorieIntake: userReceived.calorie,
                _id: _id,
                loading: false
            })
        })
    }

    componentDidMount = () => {
    	this.getUser();
    }

    getDietPlan = () => {
        let email = this.state.userEmail
        this.setState({loading: true})
        if (this.state.calorieIntake <= 2000){
            this.setState({
                //total fat, sat fat, cholesterol, sodium, potassium, total carb, sugars, fieber, protein 
                nutrientLimits: [78, 20, 300, 2300, 4700, 275, 50, 28, 50]
            })
        } else {
            this.setState({
                //total fat, sat fat, cholesterol, sodium, potassium, total carb, sugars, fieber, protein 
                nutrientLimits: [83, 25, 300, 2300, 4700, 350, 50, 33, 55]
            })
        }
        fetch(API + email)
        .then(response => response.json())
        .then(data => {
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

    addBreakfast = (idx, itemKey, itemCalorie, itemCholesterol, itemSodium, itemPotassium, itemFat, itemSatFat, itemProtein, itemCarbs, itemSugars, itemDietary) => {
        let added = []
        added = this.state.chosenBr
        added[idx] = !(this.state.chosenBr[idx])
        if (added[idx] === true) {
            let breakfastChosenTemp = this.state.breakfastChosen.slice()
            breakfastChosenTemp.push(itemKey)
            this.setState({
                chosenBr: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentCholesterol: this.state.currentCholesterol + itemCholesterol,
                currentSodium: this.state.currentSodium + itemSodium,
                currentPotassium: this.state.currentPotassium + itemPotassium,
                currentFat: this.state.currentFat + itemFat,
                currentsatFat: this.state.currentsatFat + itemSatFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                currentSugars: this.state.currentSugars + itemSugars,
                currentDietary: this.state.currentDietary + itemDietary,
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

    addLunch = (idx, itemKey, itemCalorie, itemCholesterol, itemSodium, itemPotassium, itemFat, itemSatFat, itemProtein, itemCarbs, itemSugars, itemDietary) => {
        let added = []
        added = this.state.chosenLu
        added[idx] = !(this.state.chosenLu[idx])
        if (added[idx] === true) {
            let lunchChosenTemp = this.state.lunchChosen.slice()
            lunchChosenTemp.push(itemKey)
            this.setState({
                chosenLu: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentCholesterol: this.state.currentCholesterol + itemCholesterol,
                currentSodium: this.state.currentSodium + itemSodium,
                currentPotassium: this.state.currentPotassium + itemPotassium,
                currentFat: this.state.currentFat + itemFat,
                currentsatFat: this.state.currentsatFat + itemSatFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                currentSugars: this.state.currentSugars + itemSugars,
                currentDietary: this.state.currentDietary + itemDietary,
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
                currentCholesterol: this.state.currentCholesterol - itemCholesterol,
                currentSodium: this.state.currentSodium - itemSodium,
                currentPotassium: this.state.currentPotassium - itemPotassium,
                currentFat: this.state.currentFat - itemFat,
                currentsatFat: this.state.currentsatFat - itemSatFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                currentSugars: this.state.currentSugars - itemSugars,
                currentDietary: this.state.currentDietary - itemDietary,
                lunchChosen: lunchChosenTemp
            })
        }
    }

    addSoup = (idx, itemKey, itemCalorie, itemCholesterol, itemSodium, itemPotassium, itemFat, itemSatFat, itemProtein, itemCarbs, itemSugars, itemDietary) => {
        let added = []
        added = this.state.chosenSou
        added[idx] = !(this.state.chosenSou[idx])
        if (added[idx] === true) {
            let soupChosenTemp = this.state.soupChosen.slice()
            soupChosenTemp.push(itemKey)
            this.setState({
                chosenSou: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentCholesterol: this.state.currentCholesterol + itemCholesterol,
                currentSodium: this.state.currentSodium + itemSodium,
                currentPotassium: this.state.currentPotassium + itemPotassium,
                currentFat: this.state.currentFat + itemFat,
                currentsatFat: this.state.currentsatFat + itemSatFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                currentSugars: this.state.currentSugars + itemSugars,
                currentDietary: this.state.currentDietary + itemDietary,
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
                currentCholesterol: this.state.currentCholesterol - itemCholesterol,
                currentSodium: this.state.currentSodium - itemSodium,
                currentPotassium: this.state.currentPotassium - itemPotassium,
                currentFat: this.state.currentFat - itemFat,
                currentsatFat: this.state.currentsatFat - itemSatFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                currentSugars: this.state.currentSugars - itemSugars,
                currentDietary: this.state.currentDietary - itemDietary,
                soupChosen: soupChosenTemp
            })
        }
    }

    addMainDish = (idx, itemKey, itemCalorie, itemCholesterol, itemSodium, itemPotassium, itemFat, itemSatFat, itemProtein, itemCarbs, itemSugars, itemDietary) => {
        let added = []
        added = this.state.chosenMa
        added[idx] = !(this.state.chosenMa[idx])
        if (added[idx] === true) {
            let mainDishChosenTemp = this.state.mainDishChosen.slice()
            mainDishChosenTemp.push(itemKey)
            this.setState({
                chosenMa: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentCholesterol: this.state.currentCholesterol + itemCholesterol,
                currentSodium: this.state.currentSodium + itemSodium,
                currentPotassium: this.state.currentPotassium + itemPotassium,
                currentFat: this.state.currentFat + itemFat,
                currentsatFat: this.state.currentsatFat + itemSatFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                currentSugars: this.state.currentSugars + itemSugars,
                currentDietary: this.state.currentDietary + itemDietary,
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
                currentCholesterol: this.state.currentCholesterol - itemCholesterol,
                currentSodium: this.state.currentSodium - itemSodium,
                currentPotassium: this.state.currentPotassium - itemPotassium,
                currentFat: this.state.currentFat - itemFat,
                currentsatFat: this.state.currentsatFat - itemSatFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                currentSugars: this.state.currentSugars - itemSugars,
                currentDietary: this.state.currentDietary - itemDietary,
                mainDishChosen: mainDishChosenTemp
            })
        }
    }

    addDessert = (idx, itemKey, itemCalorie, itemCholesterol, itemSodium, itemPotassium, itemFat, itemSatFat, itemProtein, itemCarbs, itemSugars, itemDietary) => {
        let added = []
        added = this.state.chosenDe
        added[idx] = !(this.state.chosenDe[idx])
        if (added[idx] === true) {
            let dessertChosenTemp = this.state.dessertChosen.slice()
            dessertChosenTemp.push(itemKey)
            this.setState({
                chosenDe: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
                currentCholesterol: this.state.currentCholesterol + itemCholesterol,
                currentSodium: this.state.currentSodium + itemSodium,
                currentPotassium: this.state.currentPotassium + itemPotassium,
                currentFat: this.state.currentFat + itemFat,
                currentsatFat: this.state.currentsatFat + itemSatFat,
                currentProtein: this.state.currentProtein + itemProtein,
                currentCarbs: this.state.currentCarbs + itemCarbs,
                currentSugars: this.state.currentSugars + itemSugars,
                currentDietary: this.state.currentDietary + itemDietary,
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
                currentCholesterol: this.state.currentCholesterol - itemCholesterol,
                currentSodium: this.state.currentSodium - itemSodium,
                currentPotassium: this.state.currentPotassium - itemPotassium,
                currentFat: this.state.currentFat - itemFat,
                currentsatFat: this.state.currentsatFat - itemSatFat,
                currentProtein: this.state.currentProtein - itemProtein,
                currentCarbs: this.state.currentCarbs - itemCarbs,
                currentSugars: this.state.currentSugars - itemSugars,
                currentDietary: this.state.currentDietary - itemDietary,
                dessertChosen: dessertChosenTemp
            })
        }
    }

    submit = () => {
        app.database().ref(`users/${this.state._id}/dietPlan`).push({
            breakfast: this.state.breakfastChosen,
            lunch: this.state.lunchChosen,
            soup: this.state.soupChosen,
            mainDish: this.state.mainDishChosen,
            dessert: this.state.dessertChosen,
            calorie: this.state.currentCalorie,
            cholesterol: this.state.currentCholesterol,
            sodium: this.state.currentSodium,
            potassium: this.state.currentPotassium,
            fat: this.state.currentFat,
            satFat: this.state.currentsatFat,
            protein: this.state.currentProtein,
            carbs: this.state.currentCarbs,
            sugars: this.state.currentSugars,
            dietary: this.state.currentDietary
        })
        this.props.history.push('/userprofile', {_id: this.state._id})
    }

    showDietPlan = () => {
        this.props.history.push('/userprofile', {_id: this.state._id})
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
                        <RaisedButton label='GENERATE DIET PLAN' primary={true} onClick={this.getDietPlan} style={buttonStyle} disabled={false}/>
                        <RaisedButton label='SHOW LAST DIET PLAN' primary={true} onClick={this.showDietPlan} style={buttonStyle} disabled={false}/>
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
                                                <TableRowColumn>Cholesterol</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Saturated fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sodium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Potassium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sugars</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Dietary fiber</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>(idx, itemKey, itemCalorie, itemCholesterol, itemSodium, itemPotassium, itemFat, itemSatFat, itemProtein, itemCarbs, itemSugars, itemDietary)
                                    {this.state.chosenBr[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addBreakfast(
                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addBreakfast(
                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                        parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
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
                                                <TableRowColumn>Cholesterol</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Saturated fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sodium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Potassium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sugars</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Dietary fiber</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenLu[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addLunch(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addLunch(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
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
                                                <TableRowColumn>Cholesterol</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Saturated fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sodium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Potassium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sugars</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Dietary fiber</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenSou[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addSoup(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addSoup(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
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
                                                <TableRowColumn>Cholesterol</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Saturated fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sodium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Potassium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sugars</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Dietary fiber</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenMa[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addMainDish(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addMainDish(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
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
                                                <TableRowColumn>Cholesterol</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Saturated fat</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sodium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Potassium</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Protein</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Carbs</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10)}</TableRowColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableRowColumn>Sugars</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10)}</TableRowColumn>
                                                <TableRowColumn>Dietary fiber</TableRowColumn>
                                                <TableRowColumn>{parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10)}</TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    {this.state.chosenDe[index] ?
                                    <FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} backgroundColor={green500} onClick={() => {this.addDessert(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton style={{position: 'absolute', right: 10, bottom: 15}} onClick={() => {this.addDessert(                                        index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10), 
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOLE').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'NA').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'K').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FASAT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'PROCNT').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'CHOCDF').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'SUGAR').value, 10),
                                    parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'FIBTG').value, 10))}}>
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
                                            <TableRowColumn>Calorie limit {this.state.calorieIntake}</TableRowColumn>
                                            <TableRowColumn>Calorie {this.state.currentCalorie}</TableRowColumn>
                                            <TableRowColumn>Cholesterol limit {this.state.nutrientLimits[2]}</TableRowColumn>
                                            <TableRowColumn>Cholesterol {this.state.currentCholesterol}</TableRowColumn>
                                            <TableRowColumn>Protein limit {this.state.nutrientLimits[8]}</TableRowColumn>
                                            <TableRowColumn>Protein {this.state.currentProtein}</TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn>Fat limit {this.state.nutrientLimits[0]}</TableRowColumn>
                                            <TableRowColumn>Fat {this.state.currentFat}</TableRowColumn>
                                            <TableRowColumn>Saturated fat limit {this.state.nutrientLimits[1]}</TableRowColumn>
                                            <TableRowColumn>Saturated fat {this.state.currentsatFat}</TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                        <TableRowColumn>Sodium limit {this.state.nutrientLimits[3]}</TableRowColumn>
                                            <TableRowColumn>Sodium {this.state.currentSodium}</TableRowColumn>
                                            <TableRowColumn>Potassium limit {this.state.nutrientLimits[4]}</TableRowColumn>
                                            <TableRowColumn>Potassium {this.state.currentPotassium}</TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn>Total carbs limit {this.state.nutrientLimits[5]}</TableRowColumn>
                                            <TableRowColumn>Total carbs {this.state.currentCarbs}</TableRowColumn>
                                            <TableRowColumn>Sugars limit {this.state.nutrientLimits[6]}</TableRowColumn>
                                            <TableRowColumn>Sugars {this.state.currentSugars}</TableRowColumn>
                                            <TableRowColumn>Dietary fiber limit {this.state.nutrientLimits[7]}</TableRowColumn>
                                            <TableRowColumn>Dietary fiber {this.state.currentDietary}</TableRowColumn>
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