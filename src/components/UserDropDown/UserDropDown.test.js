import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import UserDropDown from './UserDropDown';

describe('UserDropDown component', () => {
  it('renders the dropdown when state.showDropDown is true', () => {
    const wrapper = mount(
      <MemoryRouter>
        <UserDropDown /> 
      </MemoryRouter>
    );
    wrapper.find(UserDropDown).instance().showDropDown();
    wrapper.update();
    expect(toJson(wrapper.find('#app__header-user-dropdown'))).toMatchSnapshot();
    wrapper.unmount();
  });
});