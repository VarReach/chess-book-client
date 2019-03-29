import React, { Component } from 'react';
import TokenService from '../../services/token-service';
import { Link } from 'react-router-dom';
import logo from '../../images/ChessBlogLogo.png';
import './Header.css';
import UserDropDown from '../UserDropDown/UserDropDown';
import UserContext from '../../contexts/UserContext';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.dropDown = React.createRef();
  }

  static contextType = UserContext;

  toggleDropDown = (e) => {
    this.dropDown.current.toggleDropDown(e);
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
            {TokenService.hasAuthToken() && TokenService.hasPermissions() && <Link id="app__header-editor-link" to="/editor">Editor</Link>}
            <div className="app__header-nav-user">
              <button className="app__header-nav-user-button" onClick={this.toggleDropDown}>
                {this.context.user && this.context.user.user_name
                  ? <><i className="fas fa-user"/><span>{this.context.user.user_name}</span></>
                  : <><i className="fas fa-user-slash"/><span>{'Guest'}</span></>}
                <i className="fas fa-caret-down"/>
              </button>
              <UserDropDown ref={this.dropDown} />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}