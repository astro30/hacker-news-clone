import React from 'react';
import './App.css';
import {ThemeProvider} from './contexts/theme'
import { BrowserRouter as Router, Switch, Route, useLocation} from 'react-router-dom';
import Posts from './component/Posts'
import Nav from './component/Nav';
import Loading from './component/Loading'
import User from './component/User'
import PostComment from './component/PostComment'


function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

class App extends React.Component {
  state = {
    theme: 'light',
    toggleTheme: () => {
      this.setState(({theme}) => ({theme: theme === 'light' ? 'dark' : 'light'}))
    }
  }

  render() {
    return (
      <Router>
        <ThemeProvider value={this.state}>
          <div className={this.state.theme}>
            <div className='container'>
              <Nav/>
              <React.Suspense fallback={Loading}>
                <Switch>
                  <Route exact path='/' render={() => <Posts type='top' />} />
                  <Route exact path='/new' render={() => <Posts type='new' />} />
                  <Route path='/user' component={User}/>
                  <Route path='/post' component={PostComment}/>
                  <Route component={NoMatch}/>
                </Switch>
              </React.Suspense>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    )
  }
};

export default App;
