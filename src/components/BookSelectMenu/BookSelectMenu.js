import React, { Component } from 'react';
import ChaptersContext from '../../contexts/ChaptersContext';
import './BookSelectMenu.css';

class BookSelectMenu extends Component {
  static contextType = ChaptersContext;

  renderBooks = () => {
    const books = Object.keys(this.context.books).map(bookId => {
      const book = this.context.books[bookId];
      const selectedBook = this.context.bookId;
      return (
        <li>
          <button key={bookId} disabled={bookId == selectedBook} onClick={() => this.handleOnClick(bookId)}>
            {bookId == selectedBook ? <i className="fas fa-book-open"/> : <i className="fas fa-book"/>}
            {book.title}
          </button>
        </li>)
    });
    return books;
  }

  handleOnClick = (bookId) => {
    this.context.setBookId(bookId);
  }

  render() {
    return (
      <div className="dropdown book-select__dropdown-menu">
        <div id="book-select__dropdown-scroll">
          <ul>
            {this.renderBooks()}
          </ul>
        </div>
      </div>
    )
  }
}

export default BookSelectMenu