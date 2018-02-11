import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import { FlatButton, Drawer } from 'material-ui'
import {blueGrey900} from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900,
    }
})

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                {this.props.authenticated
                    ?<div>
                    <AppBar
                        title='RecipeRecommender'
                        iconElementRight={<FlatButton label='Log Out' containerElement={<Link to='/logout' />}/>}
                        onLeftIconButtonClick={this.handleToggle}
                    />
                    <Drawer open={this.state.open}
                        docked={false}
                        onRequestChange={(open) => this.setState({open})}>
                    </Drawer>
                    </div>
                    :<div>
                    <AppBar
                        title='RecipeRecommender'
                        iconElementRight={<FlatButton label='Register/Log In' containerElement={<Link to='/login' />}/>}
                        showMenuIconButton={false}
                    />
                    </div>
                }
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Header;