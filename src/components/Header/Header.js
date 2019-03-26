import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TokenService from '../../services/token-service';
import { Link } from 'react-router-dom';
import logo from '../../images/ChessBlogLogo.png';
import './Header.css';
import UserContext from '../../contexts/UserContext';

export default class Header extends Component {
  state = {
    showDropDown: false,
  }

  static contextType = UserContext;

  componentWillUnmount() {
    if (this.state.showDropDown) {
      document.removeEventListener('click', this.closeDropDown);
    }
  }

  toggleDropDown = (e) => {
    if (e && ReactDOM.findDOMNode(this.refs.dropdown).contains(e.target)) {
      return;
    }
    this.state.showDropDown ? this.hideDropDown() : this.showDropDown();
  }

  showDropDown = () => {
    this.setState({ showDropDown: true }, () => {document.addEventListener('click', this.hideDropDown)});
  }

  hideDropDown = () => {
    this.setState({ showDropDown: false }, () => {document.removeEventListener('click', this.hideDropDown)});
  }

  render() {
    return (
      <nav role="navigation" className="app__header">
        <div className="container app__header-container">
          <Link to="/" className="app__header-title">
            <img src={logo} alt="Chess Piece: Rook"/>
            <span>ChessBook</span>
          </Link> 
          <div className="app__header-nav">
            {TokenService.hasAuthToken() && TokenService.hasPermissions() && <Link to="/editor">Editor</Link>}
            <div className="app__header-nav-user">
              <button className="app__header-nav-user-button" onClick={this.toggleDropDown}>
                {this.context.user && this.context.user.user_name
                  ? <><i className="fas fa-user"/><span>{this.context.user.user_name}</span></>
                  : <><i className="fas fa-user-slash"/><span>{'Guest'}</span></>}
                <i className="fas fa-caret-down"/>
              </button>
              <div ref="dropdown" className={"dropdown app__header-user-dropdown" + (!this.state.showDropDown ? ' hidden' : '')}>
                <ul>
                 {TokenService.hasAuthToken()
                    ? <li><Link to ="/" onClick={this.context.logout}>Logout</Link></li>
                    : (
                        <>
                          <li><Link to="/login"><i className="fas fa-sign-in-alt"/>Log in</Link></li>
                          <li><Link to="/login"><i className="fas fa-user-plus"/>Sign up</Link></li>
                        </>
                    )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}