import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../Utils/PrivateRoute';
import PublicOnlyRoute from '../Utils/PublicOnlyRoute';
import LoginPage from '../../routes/LoginPage/LoginPage'
import UserContext from '../../contexts/UserContext';
import HomePage from '../../routes/HomePage/HomePage';
import ChapterPage from '../../routes/ChapterPage/ChapterPage';
import EditorPage from '../../routes/EditorPage/EditorPage';
import Header from '../Header/Header';
import NotFoundPage from '../../routes/NotFoundPage/NotFoundPage';
import './App.css'

class App extends Component {
  static contextType = UserContext;

  componentDidMount() {
    this.context.setIdleTimer()
  }

  componentWillUnmount() {
    this.context.unsetIdleTimer();
  }

  render() {
    return (
      <>
        <Header />
          <main>
            <Switch>
              <PublicOnlyRoute
                path='/login'
                component={LoginPage}
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
        {/* <Route
          exact path={'editor/chapters/:chapterId/articles'}
          component={EditorArticlesPage}
        />
        <Route
          path={'editor/chapters/:chapterId/articles/:articleId'}
          component={EditorArticlePage}
        /> */}
      </>
    );
  }
}

export default App
