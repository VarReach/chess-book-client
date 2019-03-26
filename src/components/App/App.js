import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import PrivateRoute from '../Utils/PrivateRoute';
import PublicOnlyRoute from '../Utils/PublicOnlyRoute';
import LoginPage from '../../routes/LoginPage/LoginPage'
import { ChaptersProvider } from '../../contexts/ChaptersContext';
import UserContext from '../../contexts/UserContext';

import ChaptersListPage from '../../routes/ChaptersListPage/ChaptersListPage';
import ChapterPage from '../../routes/ChapterPage/ChapterPage';
import EditorPage from '../../routes/EditorPage/EditorPage';
import Header from '../Header/Header';

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
            
            <PublicOnlyRoute
              path='/login'
              component={LoginPage}
            />
            <ChaptersProvider>
              <Route
                exact
                path="/"
                component={ChaptersListPage}
              />
              <Route
                path="/book/:bookId/chapter/:chapterIndex"
                component={ChapterPage}
              />
            </ChaptersProvider>
            <PrivateRoute
              path='/editor'
              component={EditorPage}
            />
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
