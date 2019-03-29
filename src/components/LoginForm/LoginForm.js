import React, { Component } from 'react'
import AuthApiService from '../../services/auth-api-service';
import { Link } from 'react-router-dom';
import Error from '../../components/Error/Error';

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {}
  }

  state = { error: null }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const { user_name, password } = e.target;

    AuthApiService.postLogin({
      user_name: user_name.value,
      password: password.value,
    })
      .then(() => {
        user_name.value = '';
        password.value = '';
        this.props.onLoginSuccess();
      })
      .catch(error => {
        this.setState({ error });
      });
    user_name.value = '';
    password.value = '';
  }

  resetError = (e) => {
    e.preventDefault();
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state
    return (
      <form
        className="form"
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
            id="login-form__user-name-input"/>
        </div>
        <div className="form__input-holder">
          <label htmlFor="form__password">
            Password
          </label>
          <input className="form__password-input"
            required
            name="password"
            type="password"
            id="login-form__password"/>
        </div>
        <button type="submit" className="form__button">
          Log in
        </button>
        <div className="form__register-holder">
          <span>new?</span>
        </div>
        <Link to="/register">Create an account</Link>
      </form>
    )
  }
}
