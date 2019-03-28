import React, { Component } from 'react';

export default class Error extends Component {
  render() {
    return (
      <div className="error">
        <span>{this.props.error}</span>
        <button onClick={this.props.hideError}><i className="fas fa-times"/></button>
      </div>
    );
  }
}