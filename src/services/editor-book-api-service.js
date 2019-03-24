import config from '../config';
import TokenService from './token-service';

const EditorChaptersApiService = {
  getChaptersByBookId(id) {
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
  updateBook(id) {
    const options = {
      method: 'GET',
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

export default EditorChaptersApiService;