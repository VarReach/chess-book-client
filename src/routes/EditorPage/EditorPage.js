import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import { EditorBookProvider } from '../../contexts/EditorBookContext';
import EditorBookPage from '../EditorBookPage/EditorBookPage';

class EditorPage extends Component {
  render() {
    return (
      <EditorBookProvider>
        <section>
          <Route
            path='/editor/books/:bookId'
            component={EditorBookPage}
          />
        </section>
      </EditorBookProvider>
    );
  }
}

export default EditorPage