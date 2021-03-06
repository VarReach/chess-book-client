import React, { Component } from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './RegisterPage.css';

export default class RegisterPage extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  }

  onRegistrationSuccess = (user) => {
    const { history } = this.props;
    history.push('/login');
  }

  render() {
    return (
      <section className="form-section">
        <div className="form-holder">
          <h2>Register</h2>
          <RegisterForm
            onRegistrationSuccess={this.onRegistrationSuccess}
          />
        </div>
      </section>
    )
  }
}