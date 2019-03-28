import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ChapterList from './ChapterList';

describe('ChapterList component', () => {
  const props = {
    chapters: [
      {
        title: 'chapter 1 title'
      },
      {
        title: 'chapter 2 title'
      }
    ],
  }

  it('renders the list', () => {
    const wrapper = shallow(<ChapterList/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders the list given props', () => {
    const wrapper = shallow(<ChapterList {...props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});