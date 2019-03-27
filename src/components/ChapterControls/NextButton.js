import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link } from 'react-router-dom';

export default class NextButton extends Component {
  static contextType = UserContext;

  render() {
    return (
      <>
        <Link
            className="article__chapter-controls"
            to={"/"}
            onClick={(e) => this.props.handleOnClick(e, this.props.bookId, this.props.chapterIndex + 1)}
        >
          <i className='fas fa-angle-right'/>
        </Link>
      </>
    )
  }
}