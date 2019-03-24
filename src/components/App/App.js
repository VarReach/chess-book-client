import React, { Component } from 'react'
import config from '../../config';
import { Route, Link } from 'react-router-dom';
import './App.css'
import LoginPage from '../../routes/LoginPage/LoginPage'

import ChaptersPage from '../../routes/ChaptersPage/ChaptersPage';
import { ChaptersProvider } from '../../contexts/ChaptersContext';
import { ArticleProvider } from '../../contexts/ArticleContext';

import ArticlePage from '../../routes/ArticlePage/ArticlePage';
import EditorPage from '../../routes/EditorPage/EditorPage';

class App extends Component {
  render() {
    return (
      <main role="main">
        <Link to="/">Home</Link><br/>
        <Link to="/login">Log in</Link><br/>
        <Link to="/editor">Editor</Link>
        <ChaptersProvider>
          <ArticleProvider>
            <Route
              path={'/login'}
              component={LoginPage}
            />
          </ArticleProvider>
        </ChaptersProvider>
        <Route
          path={'/editor'}
          component={EditorPage}
        />
        {/* <Route
          exact path={'editor/chapters/:chapterId/articles'}
          component={EditorArticlesPage}
        />
        <Route
          path={'editor/chapters/:chapterId/articles/:articleId'}
          component={EditorArticlePage}
        /> */}
      </main>
    );
  }
}

export default App
