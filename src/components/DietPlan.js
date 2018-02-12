import React, { Component } from 'react'
import { AppBar, Card, CardTitle, CardMedia, CardActions, RefreshIndicator, RaisedButton, FloatingActionButton } from 'material-ui'
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
            breakfastChosen: [],
            lunchChosen: [],
            soupChosen: [],
            maindishChosen: [],
            dessertChosen: [],
            submit: false,
            chosenBr: [false, false, false, false],
            chosenLu: [0, 0, 0, 0],
            chosenSou: [0, 0, 0, 0],
            chosenMa: [0, 0, 0, 0],
            chosenDe: [0, 0, 0, 0]
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

    addBreakfast = (idx, itemKey, itemCalorie) => {
        console.log(this.state.chosenBr)
        let added = []
        added = this.state.chosenBr
        added[idx] = !(this.state.chosenBr[idx])
        if (added[idx] === true) {
            let breakfastChosenTemp = this.state.breakfastChosen.slice()
            breakfastChosenTemp.push(itemKey)
            this.setState({
                chosenBr: added,
                currentCalorie: this.state.currentCalorie + itemCalorie,
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
                breakfastChosen: breakfastChosenTemp
            })
        }
    }

    addLunch = (itemKey, itemCalorie) => {
        this.setState(({itemCalorie}) => ({
            chosenLu: !this.state.chosenLu,
            currentCalorie: this.state.currentCalorie + itemCalorie,
            lunchChosen: itemKey
            })
        )
    }

    addSoup = (itemKey, itemCalorie) => {
        this.setState(({itemCalorie}) => ({
            chosenSou: !this.state.chosenSou,
            currentCalorie: this.state.currentCalorie + itemCalorie,
            soupChosen: itemKey
            })
        )
    }

    addMainDish = (itemKey, itemCalorie) => {
        this.setState(({itemCalorie}) => ({
            chosenMa: !this.state.chosenMa,
            currentCalorie: this.state.currentCalorie + itemCalorie,
            maindishChosen: itemKey
            })
        )
    }

    addDessert = (itemKey, itemCalorie) => {
        this.setState(({itemCalorie}) => ({
            chosenDe: !this.state.chosenDe,
            currentCalorie: this.state.currentCalorie + itemCalorie,
            dessertChosen: itemKey
            })
        )
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
                        top={30}
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
                            <div style={{position: 'sticky'}}>
                            <AppBar
                                title={`Daily calorie intake: ${this.state.calorieIntake} Calorie from chosen food: ${this.state.currentCalorie}`}
                                showMenuIconButton={false}
                                style={{textAlign: 'center'}}
                            />
                            </div>
                            {this.state.breakfasts.map((tile, index) => (
                            <Card style={{width:'50%', display: 'inline-block', padding: '10px'}}>
                                <CardMedia
                                    overlay={<CardTitle title={tile.name}/>}
                                    >
                                    <img src={tile.images[0].imageUrlsBySize[360]} alt="" />
                                </CardMedia>
                                <CardActions>
                                    <div style={{fontSize: '30px', textAlign: 'center'}}>
                                        Calories: {parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10)}
                                    </div>
                                    {this.state.chosenBr[index] ?
                                    <FloatingActionButton backgroundColor={green500} onClick={() => {this.addBreakfast(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                    :<FloatingActionButton onClick={() => {this.addBreakfast(index, tile.key, parseInt(tile.nutritionEstimates.find(obj => obj.attribute === 'ENERC_KCAL').value, 10))}}>
                                        <ContentAdd />
                                    </FloatingActionButton>}
                                </CardActions>
                            </Card>
                            ))}{this.state.breakfastChosen.length > 0
                            ? <RaisedButton label='SUBMIT' primary={true} onClick={this.submit} fullWidth={true} disabled={false}/> 
                            : <RaisedButton label='SUBMIT' primary={true} onClick={this.submit} fullWidth={true} disabled={true}/>}
                        </div>
                    </ MuiThemeProvider>
                )
            }
        }
    }
}

export default DietPlan;