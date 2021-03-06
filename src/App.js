import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Header  from './components/Header'
import Login from './components/Login'
import Logout from './components/Logout'
import FirstUse from './components/FirstUse'
import ColdStart from './components/ColdStart'
import DietPlan  from './components/DietPlan'
import Recipe  from './components/Recipe'
import UserProfile from './components/UserProfile'
import Search from './components/Search'
import { app } from './base'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {blueGrey900} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900,
    }
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    }
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        })
      } else {
        this.setState({
          authenticated: false,
          loading: false
        })
      }
    })  
  }

  componentWillUnmount() {
    this.removeAuthListener();
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
    }
    if (this.state.authenticated === true) {
      return (
        <div style={{maxWidth: '1160px', margin: '0 auto'}}>
          <BrowserRouter>
            <div className='header'>
              <Header authenticated={this.state.authenticated}/>
                <div className='main-content' style={{padding: '1em'}}>
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/logout' component={Logout} />
                  <Route exact path='/firstuse' component={FirstUse} />
                  <Route exact path='/coldstart' component={ColdStart} />
                  <Route exact path='/dietplan' component={DietPlan} />
                  <Route exact path='/userprofile' component={UserProfile} />
                  <Route exact path='/search' component={Search} />
                  <Route path='/recipe/:recipeId' component={Recipe} />
                </div>
              </div>
            </BrowserRouter>
        </div>
      )
    } else {
      return (
        <div style={{maxWidth: '1160px', margin: '0 auto'}}>
          <BrowserRouter>
            <div className='header'>
              <Header authenticated={this.state.authenticated}/>
                <div className='main-content' style={{padding: '1em'}}>
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/logout' component={Logout} />
                </div>
              </div>
            </BrowserRouter>
        </div>
      )
    }
  }
}

export default App;