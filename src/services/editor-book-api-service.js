import config from '../config';
import TokenService from './token-service';

const EditorBookApiService = {
  getAllBooks() {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    };
    return fetch(`${config.API_ENDPOINT}/editor/books`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
  getChaptersByBookId(id) {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    };
    return fetch(`${config.API_ENDPOINT}/editor/books/${id}/chapters`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
  getBookById(id) {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    };
    return fetch(`${config.API_ENDPOINT}/editor/books/${id}`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
  updateBook(id, newBook) {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(newBook),
    };
    return fetch(`${config.API_ENDPOINT}/editor/books/${id}`, options)
      .then(res => {
        return (!res.ok) 
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      });
  },
  createBook(newBook) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(newBook)
    };
    return fetch(`${config.API_ENDPOINT}/editor/books`, options)
      .then(res => {
        return (!res.ok) 
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      });
  },
  deleteBook(id) {
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    };
    return fetch(`${config.API_ENDPOINT}/editor/books/${id}`, options)
      .then(res => {
        if (!res.ok) {
          Promise.reject(`Unable to update book ${id}`);
        }
      });
  }
}

export default EditorBookApiService;