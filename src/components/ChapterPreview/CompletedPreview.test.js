import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import CompletedPreview from './CompletedPreview';

describe(`NotefulForm component`, () => {
  const props = {
    date: 'this is a date'
  };

  it('renders a CompletedPreview by default', () => {
    const wrapper = shallow(<CompletedPreview />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders the CompletedPreview given props', () => {
    const wrapper = shallow(<CompletedPreview {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})