import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import NextButton from './NextButton';

describe('NextButton component', () => {
  it('renders the button', () => {
    const wrapper = shallow(<NextButton/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});