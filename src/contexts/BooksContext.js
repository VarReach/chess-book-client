import React, { Component } from 'react'

const BooksContext = React.createContext({
  bookId: null,
  books: {},
  error: null,
  setBooks: () => {},
  setBookId: () => {},
  setError: () => {},
});

export default BooksContext;

export class BooksProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: null,
      books: {},
      error: null,
      setBooks: this.setBooks,
      setBookId: this.setBookId,
      setError: this.setError
    };
  }

  setBooks = (books, bookId, fn) => {
    this.setState({ books }, () => {
      this.setBookId(bookId, fn);
      fn && fn();
    });
  }

  setBookId = (bookId) => {
    this.setState({ bookId });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <BooksContext.Provider value={this.state}>
        {this.props.children}
      </BooksContext.Provider>
    )
  }
}
