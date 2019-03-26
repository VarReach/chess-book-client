import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import { EditorBookProvider } from '../../contexts/EditorBookContext';
import EditorBookPage from '../EditorBookPage/EditorBookPage';
import EditorChapterPage from '../EditorChapterPage/EditorChapterPage';
import EditorBooksListPage from '../EditorBooksListPage/EditorBooksListPage';

class EditorPage extends Component {
  render() {
    return (
      <EditorBookProvider>
        <section>
          <Route
            exact
            path="/editor"
            component={EditorBooksListPage}
          />
          <Route
            path='/editor/books/:bookId'
            component={EditorBookPage}
          />
          <Route
            path='/editor/chapters/:chapterId'
            component={EditorChapterPage}
          />
        </section>
      </EditorBookProvider>
    );
  }
}

export default EditorPage