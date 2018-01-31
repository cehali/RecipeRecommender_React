import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { GridList, GridTile, RaisedButton, IconMenu, MenuItem, IconButton } from 'material-ui'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'


const buttonStyle = {
    width: '100%'
}

class ColdStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            nrStage: 0
        }
        this.goToNextStage = this.goToNextStage.bind(this)
        this.endColdStart = this.endColdStart.bind(this)
    }

    getItems = () => {
        var recipesReceived = []
        let ref = app.database().ref();
        ref.once('value', function(snapshot) {
          snapshot.forEach(function(child) {
            recipesReceived.push({
                name: child.val().name,
                photo: child.val().images[0].imageUrlsBySize[360],
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
    
    goToNextStage = () => {
        this.setState(({nrStage}) => ({
            nrStage: nrStage + 1
        }));
    }

    endColdStart = () => {
        this.props.history.push('/recipes')
    }

    

    render() {
        if (this.state.nrStage === 0){
            return (
                <MuiThemeProvider>
                <GridList
                    cellHeight='100%'
                >
                    {this.state.recipes.map((tile) => (
                        <GridTile
                            title={tile.name}
                            actionIcon={
                                <IconMenu
                                    iconButtonElement={<IconButton><StarBorder color='white'/></IconButton>}
                                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                    onItemClick={(ev, obj, idx) => console.log(obj.props.value)}
                                >
                                <MenuItem value='5' primaryText='5'/>
                                <MenuItem value='4' primaryText='4'/>
                                <MenuItem value='3' primaryText='3'/>
                                <MenuItem value='2' primaryText='2'/>
                                <MenuItem value='1' primaryText='1'/>
                                </IconMenu>
                            }
                            c     >                        
                        <img src={tile.photo} alt='' translatex='0'/>
                        </GridTile>
                    ))}
                </GridList>
                <RaisedButton label="NEXT" primary={true} onClick={this.goToNextStage} style={buttonStyle}/>
                </MuiThemeProvider>
            )
        } else if (this.state.nrStage === 1) {
            return (
            <MuiThemeProvider>
               <RaisedButton label="NEXT" primary={true} onClick={this.goToNextStage}/>
           </MuiThemeProvider>
            )
        } else if (this.state.nrStage === 2) {
            return(
            <MuiThemeProvider>
               <RaisedButton label="NEXT" primary={true} onClick={this.goToNextStage}/>
           </MuiThemeProvider>
            )
        } else if (this.state.nrStage === 3) {
            return(
            <MuiThemeProvider>
               <RaisedButton label="NEXT" primary={true} onClick={this.goToNextStage}/>
           </MuiThemeProvider>
            )
        } else if (this.state.nrStage === 4) {
            return(
            <MuiThemeProvider>
               <RaisedButton label="NEXT" primary={true} onClick={this.endColdStart}/>
           </MuiThemeProvider>
            )
        } else {

        }

    }
    
}

export default ColdStart