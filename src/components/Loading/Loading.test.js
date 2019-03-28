import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Loading from './Loading';

describe('Loading component', () => {
  it('renders the component', () => {
    const wrapper = shallow(<Loading/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders the loading animation after 1 second', (done) => {
    const wrapper = shallow(<Loading/>);
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      done();
    }, 1200);
  });

  it('render the error view when an error is in props', () => {
    const wrapper = shallow(<Loading status={true}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});