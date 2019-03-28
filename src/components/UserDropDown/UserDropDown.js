import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';

export default class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropDown: false,
    };
    this.dropDown = React.createRef();
  }

  static contextType = UserContext;

  componentWillUnmount() {
    if (this.state.showDropDown) {
      document.removeEventListener('click', this.closeDropDown);
    }
  }

  toggleDropDown = (e) => {
    if (e && this.dropDown.current.contains(e.target)) {
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
      <div ref={this.dropDown} id="app__header-user-dropdown" className={"dropdown" + (!this.state.showDropDown ? ' hidden' : '')}>
        <ul>
        {TokenService.hasAuthToken()
            ? <li><Link to ="/" onClick={this.context.logout}><i className="fas fa-door-open"/>Logout</Link></li>
            : (
                <>
                  <li><Link to="/login"><i className="fas fa-sign-in-alt"/>Log in</Link></li>
                  <li><Link to="/register"><i className="fas fa-user-plus"/>Sign up</Link></li>
                </>
            )}
        </ul>
      </div>
    )
  }
}
