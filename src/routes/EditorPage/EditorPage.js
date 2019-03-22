import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import { ChaptersEditorProvider } from '../../contexts/ChaptersEditorContext';
import ChaptersEditorPage from '../ChaptersEditorPage/ChaptersEditorPage';

class EditorPage extends Component {
  render() {
    return (
      <ChaptersEditorProvider>
        <section>
          <Route
            exact
            path="/editor"
            component={ChaptersEditorPage}
          />
        </section>
      </ChaptersEditorProvider>
    );
  }
}

export default EditorPage