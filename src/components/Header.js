import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import { FlatButton, Drawer, MenuItem } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }
    
    handleToggle = () => {this.state.open === true ? this.setState({open: false}): this.setState({open: true})};


    render() {
        return (
            <MuiThemeProvider>
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
                        <MenuItem containerElement={<Link to='/search' />} onClick={this.handleToggle}>Search Recipe</MenuItem>
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