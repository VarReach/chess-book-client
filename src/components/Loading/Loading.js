import React, { Component } from 'react';
//courtesy of @tobiasahiin (tobiasahlin.com/spinkit)
import './Loading.css';

let timeout;

export default class Loading extends Component {
  state = {
    timein: null,
  }

  componentDidMount() {
    timeout = setTimeout(() => this.setState({ timein: true }), 1000); //has to be loading for at least a second to show the loading animation
  }

  componentWillUnmount() {
    clearTimeout(timeout);
  }

  render() {
    if (this.props.status && this.state.timein) {
      return (
        <div className="error-message">
          <h1>Uh oh!</h1>
          <p>Something has gone wrong on our end.</p>
          <p>Try refreshing the page in a bit.</p>
        </div>
      );
    }
    if (this.state.timein) {
      return (
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      );
    }
    return null;
  }
}