import React from 'react';
import ReactDOM from 'react-dom';
import ChapterPage from './ChapterPage';

describe('ChapterPage tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ChapterPage />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});