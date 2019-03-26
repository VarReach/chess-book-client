import React, { Component } from 'react'
import IdleService from '../services/idle-service';
import TokenService from '../services/token-service';
import AuthApiService from '../services/auth-api-service';

const UserContext = React.createContext({
  user: {},
  error: null,
  getUserInfo: () => {},
  logout: () => {},
  setIdleTimer: () => {},
  unsetIdleTimer: () => {},
  setError: () => {},
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      getUserInfo: this.getUserInfo,
      setIdleTimer: this.setIdleTimer,
      unsetIdleTimer: this.unsetIdleTimer,
      logout: this.logout,
      setError: this.setError
    };
  }

  getUserInfo = () => {
    AuthApiService.getUserInfo()
      .then(user => {
        this.setUser(user);
      })
      .catch(error => {
        console.error(error);
        this.logout();
      });
  }

  setIdleTimer = () => {
    IdleService.setIdleCallback(this.logout);
    // if a user is logged in: //
    if (TokenService.hasAuthToken()) {
      this.getUserInfo();
      IdleService.registerIdleTimerResets();
      TokenService.queueCallbackBeforeExpiry(() => {
        AuthApiService.postRefreshToken();
      });
    }
  }

  unsetIdleTimer = () => {
    IdleService.unRegisterIdleResets();
    TokenService.clearCallbackBeforeExpiry();
  }

  logout = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.clearUser();
  }

  setUser = (user) => {
    this.setState({ user });
  }
  
  clearUser = (user) => {
    this.setState({ user: {} });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}