import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import ChapterPreview from './ChapterPreview';
import { BooksProvider } from '../../contexts/BooksContext';
import { MemoryRouter } from 'react-router-dom';

describe(`NotefulForm component`, () => {
  const props = {
    chapter: {
      title: 'Chapter title',
    },
    index: 1,
  };

  it('renders a ChapterPreview by default', () => {
    const wrapper = shallow(<ChapterPreview />)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

  it('renders the ChapterPreview given props', () => {
    const wrapper = shallow(<ChapterPreview {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  });
})