import React from 'react';
import ReactDOM from 'react-dom';
import RegisterPage from './RegisterPage';
import { MemoryRouter } from 'react-router-dom';

describe('RegisterPage tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
      ,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});