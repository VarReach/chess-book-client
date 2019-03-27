import React, { Component } from 'react'
import ChaptersContext from '../../contexts/ChaptersContext';
import BooksApiService from '../../services/books-api-service';
import ChapterPreview from '../../components/ChapterPreview/ChapterPreview';
import BookSelectMenu from '../../components/BookSelectMenu/BookSelectMenu';
import './ChaptersListPage.css';

class ChaptersList extends Component {
  static contextType = ChaptersContext;

  componentDidMount() {
    BooksApiService.getAllBooks()
      .then(books => {
        let defaultBook;
        let booksObj = {};
        books.forEach(book => {
          booksObj[book.id] = book;
          book.default_book && (defaultBook = book.id);
        });
        this.context.setInitialBook(defaultBook, booksObj);
      }); 
  }

  renderChapters = () => {
    return this.context.chapters.map((chapter, i) => {
      return (
        <ChapterPreview key={i} index={i}/>
      )
    });
  }

  render() {
    return (
      <>
        <header role="banner" className="container chapters-list__header">
          <div className="chapters-list__book-details">
            {this.context.bookId && <h1>{this.context.books[this.context.bookId].title}</h1>}
            {this.context.bookId && <h3>{this.context.books[this.context.bookId].blurb}</h3>}
          </div>
          <button className="chapters-list__header-book-button"><i className="fas fa-bars"/></button>
          <BookSelectMenu/>
        </header>
        <section className="container">
          {this.context.chapters && this.renderChapters()}
        </section>
      </>
    );
  }
}

export default ChaptersList
