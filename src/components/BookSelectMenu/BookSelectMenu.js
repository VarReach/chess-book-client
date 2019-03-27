import React, { Component } from 'react';
import BooksContext from '../../contexts/BooksContext';
import './BookSelectMenu.css';

class BookSelectMenu extends Component {
  static contextType = BooksContext;

  renderBooks = () => {
    const books = Object.keys(this.context.books).map(bookId => {
      const book = this.context.books[bookId];
      const selectedBook = this.context.bookId;
      const rightBookId = (parseInt(bookId) === parseInt(selectedBook));
      return (
        <li key={bookId}>
          <button disabled={rightBookId} onClick={() => this.handleOnClick(bookId)}>
            {rightBookId ? <i className="fas fa-book-open"/> : <i className="fas fa-book"/>}
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
      <div id="book-select__dropdown-scroll">
        <ul>
          {this.renderBooks()}
        </ul>
      </div>
    )
  }
}

export default BookSelectMenu