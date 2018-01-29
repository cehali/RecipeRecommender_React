import React, { Component } from 'react'
import {GridList, GridTile} from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import Subheader from 'material-ui/Subheader'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'


const styles = {
  gridList: {
    overflow: 'auto',
  },
};

class GridListExampleSimple extends Component {
    constructor() {
        super();
        this.state = {
            recipes: []
        }
    }

    getItems = () => {
        var recipesReceived = []
        let ref = app.database().ref();
        ref.once('value', function(snapshot) {
          snapshot.forEach(function(child) {
            recipesReceived.push({
                name: child.val().name,
                photo: child.val().images,
                _key: child.key
            });
          });
        }).catch((error) => {
            console.log("The read failed: " + error.message);
        }).then(() => {
            this.setState({recipes: recipesReceived});
            console.log(recipesReceived[0].photo[0].hostedLargeUrl)            
        }); 
      }
    
      componentDidMount = () => {
        this.getItems();
      }
    
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <GridList
                    cellHeight={180}
                    style={styles.gridList}
                    >
                    {this.state.recipes.map((tile) => (
                        <GridTile
                        title={tile.name}
                        actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                        >
                        <img src={tile.photo[0].hostedLargeUrl} />
                        </GridTile>
                    ))}
                    </GridList>
                </div>
            </ MuiThemeProvider>
        )
    }
    
}

export default GridListExampleSimple;