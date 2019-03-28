import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RegisterForm from './RegisterForm';

describe('RegisterForm component', () => {
  it('renders the form', () => {
    const wrapper = shallow(<RegisterForm/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});