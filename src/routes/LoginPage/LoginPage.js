import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import UserContext from '../../contexts/UserContext';

export default class LoginPage extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  }

  static contextType = UserContext;

  handleLoginSuccess = () => {
    const { location, history } = this.props;
    const destination = (location.state || {}).from || '/';
    this.context.getUserInfo();
    history.push(destination);
  }

  render() {
    return (
      <section className="form-section">
        <div className="form-holder">
          <h2>Log in</h2>
          <LoginForm
            onLoginSuccess={this.handleLoginSuccess}
          />
        </div>
      </section>
    )
  }
}