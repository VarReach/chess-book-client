import React, { Component } from 'react'
import BooksContext from '../../contexts/BooksContext';
import BooksApiService from '../../services/books-api-service';
import ChapterList from '../../components/ChapterList/ChapterList';
import BookSelectMenu from '../../components/BookSelectMenu/BookSelectMenu';
import Loading from '../../components/Loading/Loading';
import './HomePage.css';

class ChaptersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.dropDown = React.createRef();
  }

  static contextType = BooksContext;

  componentDidMount() {
    BooksApiService.getAllBooks()
      .then(books => {
        let defaultBook;
        let booksObj = {};
        books.forEach(book => {
          booksObj[book.id] = book;
          book.default_book && (defaultBook = book.id);
        });
        this.context.setBooks(booksObj, defaultBook, this.finishLoading);
      })
      .catch((err) => {
        this.context.setError(err);
      });
  }

  finishLoading = () => {
    this.setState({ loading: false });
  }

  toggleDropDown = (e) => {
    this.dropDown.current.toggleDropDown(e);
  }

  render() {
    const bookId = this.context.bookId;
    const chapters = (bookId && this.context.books[this.context.bookId].chapters) || [];
    if (this.state.loading) {
      return <Loading status={this.context.error}/>
    }
    return (
      <>
        <header role="banner" className="container home-page__header">
          <div className="home-page__book-details">
            {bookId && <h1>{this.context.books[bookId].title}</h1>}
            {bookId && <h3>{this.context.books[bookId].blurb}</h3>}
          </div>
          <button className="home-page__header-book-button" onClick={this.toggleDropDown}><i className="fas fa-bars"/></button>
          <BookSelectMenu ref={this.dropDown}/>
        </header>
        <ChapterList chapters={chapters}/>
      </>
    );
  }
}

export default ChaptersList
