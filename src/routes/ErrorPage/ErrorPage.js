import React, { Component } from 'react'

export default class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something has gone wrong on our end.</h1>
          <p>Try refreshing the page in a bit.</p>
        </div>
      );
    }
    return this.props.children;
  }
}