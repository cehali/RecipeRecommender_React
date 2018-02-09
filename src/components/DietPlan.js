import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { app } from '../base'


class Recipes extends Component {

    
    render() {
        return (
            <MuiThemeProvider>
                <h3> Hello there, General Kenobi </h3>
            </ MuiThemeProvider>
        )
    }
    
}

export default Recipes;