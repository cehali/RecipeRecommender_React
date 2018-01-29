import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Header extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                {this.props.authenticated
                    ?<AppBar
                        title="RecipeRecommender"
                        iconElementRight={<FlatButton label="Log Out" containerElement={<Link to="/logout" />}/>}
                        showMenuIconButton={false}
                    />
                    : <AppBar
                        title="RecipeRecommender"
                        iconElementRight={<FlatButton label="Register/Log In" containerElement={<Link to="/login" />}/>}
                        showMenuIconButton={false}
                    />
                }
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Header;