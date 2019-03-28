import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import BookSelectMenu from './BookSelectMenu';

describe('BookSelectMenu component', () => {
  it('renders the dropdown when state.showDropDown is true', () => {
    const wrapper = mount(
      <BookSelectMenu /> 
    );
    wrapper.find(BookSelectMenu).instance().showDropDown();
    wrapper.update();
    expect(toJson(wrapper.find('.book-select__dropdown-menu'))).toMatchSnapshot();
    wrapper.unmount();
  });
});