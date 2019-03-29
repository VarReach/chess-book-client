import React, { Component } from 'react'
import AuthApiService from '../../services/auth-api-service';
import { Link } from 'react-router-dom';
import Error from '../../components/Error/Error';

export default class RegisterForm extends Component {
  state = { error: null }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const { user_name, password, password_reenter } = e.target;
    if (password.value !== password_reenter.value) {
      this.setState({ error: 'Passwords must match' });
      this.resetValues(user_name, password, password_reenter);
      return;
    }

    AuthApiService.postUser({
      user_name: user_name.value,
      password: password.value,
    })
      .then(user => {
        user_name.value = '';
        password.value = '';
        password_reenter.value = '';
        this.props.onRegistrationSuccess(user);
      })
      .catch(error => {
        this.setState({ error });
      });

    user_name.value = '';
    password.value = '';
    password_reenter.value = '';
  }

  resetError = (e) => {
    e.preventDefault();
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state
    return (
      <form
        onSubmit={this.handleSubmit}
      >
        {error && <Error error={error.message} hideError={this.resetError}/>}
        <div className="form__input-holder">
          <label htmlFor="form__user-name-input">
            User name
          </label>
          <input
            required
            name="user_name"
            id="form__user-name-input"/>
        </div>
        <div className="form__input-holder">
          <label htmlFor="form__password">
            Password
          </label>
          <input className="form__password-input"
            required
            name="password"
            type="password"
            placeholder="At least 6 characters"
            id="form__password"/>
        </div>
        <div className="form__input-holder">
          <label htmlFor="form__password-reenter">
            Re-enter password
          </label>
          <input className="form__password-reenter-input"
            required
            name="password_reenter"
            type="password"
            id="form__password-reenter"/>
        </div>
        <button type="submit" className="form__button">
          Register
        </button>
        <div className="form__register-holder">
          <span>Already registered?</span>
        </div>
        <Link to="/login">Log in</Link>
      </form>
    )
  }
}
