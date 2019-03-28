import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ChapterControls from './ChapterControls';

describe('ChapterControls component', () => {
  const props = {
    bookId: 1,
    chapterId: 1,
    chapterIndex: 1,
  }

  it('renders the controls', () => {
    const wrapper = shallow(<ChapterControls/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders the controls given props', () => {
    const wrapper = shallow(<ChapterControls {...props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});