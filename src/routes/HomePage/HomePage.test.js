import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './HomePage';
import { MockBooksProvider } from '../../contexts/mocks/MockBooksContext';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('HomePage tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <HomePage />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders given context', () => {
    const wrapper = shallow(
      <MockBooksProvider>
        <HomePage />
      </MockBooksProvider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
