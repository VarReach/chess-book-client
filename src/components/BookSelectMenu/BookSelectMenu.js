import React, { Component } from 'react';
import BooksContext from '../../contexts/BooksContext';
import './BookSelectMenu.css';

class BookSelectMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropDown: null,
    }
    this.dropDown = React.createRef();
  }

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
    this.setState({ showDropDown: null }, () => {document.removeEventListener('click', this.hideDropDown)});
  }

  handleOnClick = (bookId) => {
    this.context.setBookId(bookId);
  }

  render() {
    return (
      <div className={"dropdown book-select__dropdown-menu" + (!this.state.showDropDown ? ' hidden' : '')} ref={this.dropDown}>
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