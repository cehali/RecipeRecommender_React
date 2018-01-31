import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Header  from './components/Header'
import Footer  from './components/Footer'
import Login from './components/Login'
import Logout from './components/Logout'
import FirstUse from './components/FirstUse'
import ColdStart from './components/ColdStart'
import Recipes  from './components/Recipes'
import Recipe  from './components/Recipe'
import Search from './components/Search'
import { app } from './base'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const style = {
	refresh: {
	  display: 'inline-block',
	  position: 'relative',
	},
};

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
        <MuiThemeProvider>
          <div style={{ textAlign: 'center', position: 'absolute', top: '25%', left: '50%'}}>
            <h3>Loading</h3>
            <RefreshIndicator
              size={50}
              status="loading"
              style={style.refresh}
              left={0}
              top={0}
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
                  <div className='workspace'>
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/logout' component={Logout} />
                    <Route exact path='/firstuse' component={FirstUse} />
                    <Route exact path='/coldstart' component={ColdStart} />
                    <Route exact path='/recipes' component={Recipes} />
                    <Route exact path='/search' component={Search} />
                    <Route path="/recipes/:recipeId" component={Recipe} />
                  </div>
                </div>
              </div>
            </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div style={{maxWidth: '1160px', margin: '0 auto'}}>
          <BrowserRouter>
            <div className='header'>
              <Header authenticated={this.state.authenticated}/>
                <div className='main-content' style={{padding: '1em'}}>
                  <div className='workspace'>
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/logout' component={Logout} />
                  </div>
                </div>
              </div>
            </BrowserRouter>
        </div>
      )
    }
  }
}

export default App;