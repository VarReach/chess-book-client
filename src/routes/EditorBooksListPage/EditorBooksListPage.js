import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import EditorBookApiService from '../../services/editor-book-api-service';
import Loading from '../../components/Loading/Loading';
import helpers from '../../helpers/misc-helpers';
import PopupForm from '../../components/PopupForm/PopupForm';
import Error from '../../components/Error/Error';
import './EditorBooksListPage.css'


class EditorBooksListPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      books: [],
      showEditForm: null,
      bookId: null,
      editFormInfo: {},
      error: null,
      loading: true,
    };
  }

  componentDidMount() {
    EditorBookApiService.getAllBooks()
      .then(books => {
        this.setState({ books, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  }

  handleEditOnSubmit = (e) => {
    e.preventDefault();
    this.hideError();
    const { rename, publish } = e.target;
    let newBook = {};
    if (rename.value) {
      newBook.title = rename.value;
    }
    if ( publish ) {
      newBook.published = publish.checked;
    }
    EditorBookApiService.updateBook(this.state.bookId, newBook)
      .then(book => {
        const bookIndex = this.state.books.findIndex(book => book.id === this.state.bookId);
        let newBooks = [...this.state.books];
        newBooks[bookIndex] = book;
        this.setState({ books: newBooks, showEditForm: null });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  }

  showEditBookForm = (bookId) => {
    this.setState({ showEditForm: true, bookId });
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('stop-scrolling');
  }

  hideEditBookForm = () => {
    this.setState({ showEditForm: null, bookId: null, error: null });
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('stop-scrolling');
  }

  deleteBook = (bookId, title) => {
    this.hideError();
    if (this.state.books.find(book => book.id === bookId).default_book) {
      alert('Cannot delete the default book!');
      return;
    }
    const confirmation = window.confirm(`Are you sure you want to delete book '${title}'?`)
    if (confirmation) {
      EditorBookApiService.deleteBook(bookId)
        .then(() => {
          const newBooks = [...this.state.books];
          const bookIndex = this.state.books.findIndex(book => book.id === bookId);
          newBooks.splice(bookIndex, 1);
          this.setState({ books: newBooks });
        })
        .catch(err => {
          this.setState({ error: err });
        });
    }
  }

  createNewBook = () => {
    const title = prompt('Please enter a title for your new book');
    if (!title) {
      return;
    }
    EditorBookApiService.createBook({ title })
      .then(book => {
        const newBooks = [...this.state.books];
        newBooks.push(book);
        this.setState({ books: newBooks });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  }//<i className="fas fa-bookmark"/>

  renderBooks = () => {
    return this.state.books.map(book => {
      return (
        <div key={book.id} className="editor-books-list__book">
          {book.published && 
            (<div className="editor-books-list__book-published-icon-holder">
              {book.default_book 
                ? <>
                    <i className="fas fa-book-reader editor-books-list__book-published-icon"/>
                    <span className="editor-books-list__default">Default</span>
                  </>
                : <i className="fas fa-book editor-books-list__book-published-icon"/>}
            </div>)
          }
          {!book.published && <span className="editor-books-list__wip">WIP</span>}
          <Link className="editor-books-list__book-details" to={`/editor/books/${book.id}`}>
            <h2>{book.title}</h2>
            <ul>
              <li>Created: <span>{helpers.parseDate(book.date_created)}</span></li>
              {book.date_published && <li>Published: <span>{helpers.parseDate(book.date_published)}</span></li>}
              {book.date_modified && <li>Last modified: <span>{helpers.parseDate(book.date_modified)}</span></li>}
            </ul>
          </Link>
          <div className = "editor-books-list__button-holders">
            <button onClick={() => this.showEditBookForm(book.id)}><i className="fas fa-ellipsis-h"/></button>
            <button onClick={() => this.deleteBook(book.id, book.title)}><i className="fas fa-trash"/></button>
          </div>
        </div>
      )
    });
  }

  hideError = () => {
    this.setState({ error: null });
  }

  render() {
    if (this.state.loading) {
      return <Loading status={this.state.error} />
    }
    let elements;
    if (this.state.showEditForm) {
      const book = this.state.books.find(book => book.id === this.state.bookId);
      elements = [
        {
          type: 'header',
          text: 'Edit'
        },
        {
          type: 'input',
          text: 'Enter a new name',
          props: {
            name: 'rename',
            placeholder: book.title,
            id: 'editor-books-form__rename'
          },
        },
      ];
      if (!book.default_book) {
        elements.push({
          type: 'checkbox',
          text: 'Publish?',
          props: {
            name: 'publish',
            value: 'published',
            id: 'editor-books-form__publish',
            defaultChecked: book.published
          }
        });
      }
    }
    return (
      <>
        {this.state.showEditForm && <PopupForm handleOnSubmit={this.handleEditOnSubmit} handleCancel={this.hideEditBookForm} elements={elements}/>}
        <div className="editor-books-list container">
            {this.state.error && <Error error={this.state.error.message} hideError={this.hideError} />}
            {this.renderBooks()}
            <button className="editor-books-list__placeholder" onClick={this.createNewBook}><i className="fas fa-plus"/></button>
        </div>
      </>
    );
  }
}

export default EditorBooksListPage
