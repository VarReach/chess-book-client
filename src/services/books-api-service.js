import config from '../config';

const BooksApiService = {
  getAllBooks() {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`${config.API_ENDPOINT}/books/`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
}

export default BooksApiService;