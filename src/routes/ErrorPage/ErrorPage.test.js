import React from 'react';
import ReactDOM from 'react-dom';
import ErrorPage from './ErrorPage';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('ErrorPage tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ErrorPage />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  const testChildren = [<div>testing</div>];

  it('renders given children', () => {
    const wrapper = shallow(<ErrorPage children={testChildren}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  const TestError = function() {
    return <div>Error</div>;
  }

  it('renders an error given an error', () => {
    const wrapper = shallow(
      <ErrorPage>
        <TestError />
      </ErrorPage>
    );
    wrapper.setState({ hasError: true });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});