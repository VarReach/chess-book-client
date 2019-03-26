import config from '../config';

const ChaptersApiService = {
  getChaptersByBookId(bookId) {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`${config.API_ENDPOINT}/books/${bookId}/chapters`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
}

export default ChaptersApiService;