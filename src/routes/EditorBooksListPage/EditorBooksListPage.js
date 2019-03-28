import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import EditorBookApiService from '../../services/editor-book-api-service';
import '../../../node_modules/megadraft/dist/css/megadraft.css';

class EditorChapterPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      books: [],
      blockNavigation: null,
    };
  }

  componentDidMount() {
    EditorBookApiService.getAllBooks()
      .then(books => {
        this.setState({ books });
      })
      .catch(err => {
        console.error(err);
      });
  }


  editBook = (bookId) => {
    const newTitle = prompt('Enter a new name for your book');
    EditorBookApiService.updateBook(bookId, { title: newTitle })
      .then(() => {
        const bookIndex = this.state.books.findIndex(book => book.id === bookId);
        let newBooks = [...this.state.books];
        newBooks[bookIndex].title = newTitle;
        this.setState({ books: newBooks });
      })
  }

  deleteBook = (bookId) => {
    EditorBookApiService.deleteBook(bookId)
      .then(() => {
        const newBooks = [...this.state.books];
        const bookIndex = this.state.books.findIndex(book => book.id === bookId);
        newBooks.splice(bookIndex, 1);
        this.setState({ books: newBooks });
      });
  }

  createNewBook = () => {
    const title = prompt('Please enter a title for your new book');
    EditorBookApiService.createBook({ title })
      .then(book => {
        const newBooks = [...this.state.books];
        newBooks.push(book);
        this.setState({ books: newBooks });
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderBooks = () => {
    return this.state.books.map(book => {
      return (
        <div key={book.id}>
          <Link to={`/editor/books/${book.id}`}><h2>{book.title}</h2></Link>
          <button onClick={() => this.editBook(book.id)}>edit</button>
          <button onClick={() => this.deleteBook(book.id)}>delete</button>
        </div>
      )
    });
  }

  render() {
    return (
      <>
        {this.renderBooks()}
        <button onClick={this.createNewBook}>+</button>
      </>
    );
  }
}

export default EditorChapterPage
