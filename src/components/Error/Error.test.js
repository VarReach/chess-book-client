import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Error from './Error';

describe('LoginForm component', () => {
  const props = {
    error: 'Error message',
  };

  it('renders the form by default', () => {
    const wrapper = shallow(<Error/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders the error div given props', () => {
    const wrapper = shallow(<Error {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});