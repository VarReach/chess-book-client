import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../Utils/PrivateRoute';
import PublicOnlyRoute from '../Utils/PublicOnlyRoute';
import LoginPage from '../../routes/LoginPage/LoginPage'
import UserContext from '../../contexts/UserContext';
import HomePage from '../../routes/HomePage/HomePage';
import ChapterPage from '../../routes/ChapterPage/ChapterPage';
import EditorPage from '../../routes/EditorPage/EditorPage';
import RegisterPage from '../../routes/RegisterPage/RegisterPage';
import Header from '../Header/Header';
import NotFoundPage from '../../routes/NotFoundPage/NotFoundPage';
import LandingInfo from '../LandingInfo/LandingInfo';
import LandingInfoService from '../../services/landing-info-service';
import './App.css'

class App extends Component {
  state = {
    showLandingInfo: false,
  }

  static contextType = UserContext;

  componentDidMount() {
    if (!LandingInfoService.getVisitHistoryStatus()) {
      LandingInfoService.saveVisitHistoryStatus();
      this.setState({ showLandingInfo: true });
    }
    this.context.setIdleTimer()
  }

  componentWillUnmount() {
    this.context.unsetIdleTimer();
  }

  
  handleHideLandingInfo = () => {
    this.setState({ showLandingInfo: false });
  }

  handleShowLandingInfo = () => {
    this.setState({ showLandingInfo: true });
  }

  render() {
    return (
      <>
        {(this.state.showLandingInfo) && <LandingInfo handleHideLandingInfo={this.handleHideLandingInfo}/>}
        <button onClick={this.handleShowLandingInfo} className="landing-info-button"><i className="fas fa-info"/></button>
        <Header />
          <main role="main">
            <Switch>
              <PublicOnlyRoute
                path='/login'
                component={LoginPage}
              />  
              <PublicOnlyRoute
                path='/register'
                component={RegisterPage}
              />  
              <Route
                exact
                path="/"
                component={HomePage}
              />
              <Route
                path="/book/:bookId/chapter/:chapterIndex"
                component={ChapterPage}
              />
              <PrivateRoute
                path='/editor'
                component={EditorPage}
              />
              <Route
                component={NotFoundPage}
              />
            </Switch>
          </main>
        <footer role="contentinfo" className="container footer">
        </footer>
      </>
    );
  }
}

export default App
