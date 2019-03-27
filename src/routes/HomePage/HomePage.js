import React, { Component } from 'react'
import BooksContext from '../../contexts/BooksContext';
import BooksApiService from '../../services/books-api-service';
import ChapterPreview from '../../components/ChapterPreview/ChapterPreview';
import BookSelectMenu from '../../components/BookSelectMenu/BookSelectMenu';
import './HomePage.css';

class ChaptersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropDown: false,
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
        this.context.setBooks(booksObj, defaultBook);
      }); 
  }

  renderChapters = () => {
    return this.context.books[this.context.bookId].chapters.map((chapter, i) => {
      return (
        <ChapterPreview key={i} index={i} chapter={chapter} bookId={this.context.bookId}/>
      )
    });
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
    const bookId = this.context.bookId;
    return (
      <>
        <header role="banner" className="container home-page__header">
          <div className="home-page__book-details">
            {bookId && <h1>{this.context.books[bookId].title}</h1>}
            {bookId && <h3>{this.context.books[bookId].blurb}</h3>}
          </div>
          <button className="home-page__header-book-button" onClick={this.toggleDropDown}><i className="fas fa-bars"/></button>
          <div className={"dropdown book-select__dropdown-menu" + (!this.state.showDropDown ? ' hidden' : '')} ref={this.dropDown}>
            <BookSelectMenu />
          </div>
        </header>
        <section className="container">
          {this.context.bookId && this.renderChapters()}
        </section>
      </>
    );
  }
}

export default ChaptersList