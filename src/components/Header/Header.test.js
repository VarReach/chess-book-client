import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import Header from './Header';

describe('Header component', () => {
  it('renders the complete header', () => {
    const wrapper = shallow(<Header/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('no editor link when user doesn\'t have permissions', () => {
    const editorLink = shallow(<Header />)
      .find('#app__header-editor-link');
    expect(toJson(editorLink)).toMatchSnapshot();
  });

  it('no dropdown by default', () => {
    const dropDown = shallow(<Header />)
      .find('#app__header-user-dropdown');
    expect(toJson(dropDown)).toMatchSnapshot();
  });

  it('shows dropdown on button click', () => {
    const header = mount(
      <MemoryRouter>
        <Header /> 
      </MemoryRouter>
    );
    header.find('.app__header-nav-user-button').simulate('click');
    expect(toJson(header.find('#app__header-user-dropdown'))).toMatchSnapshot();
    header.unmount();
  });
});