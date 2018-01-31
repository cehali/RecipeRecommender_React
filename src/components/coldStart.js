import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { GridList, GridTile, RaisedButton } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'


const styles = {
  gridList: {
    overflow: 'auto',
  },
};

class coldStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            nrStage: 0
        }
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
        this.setState({goToNextStage: (this.state.nrStage + 1)})
    }

    render() {
        return (
            <MuiThemeProvider>
                <RaisedButton label="NEXT" primary={true} onClick={this.goToNextStage()}/>
            </MuiThemeProvider>
        )
    }
    
}

export default coldStart;