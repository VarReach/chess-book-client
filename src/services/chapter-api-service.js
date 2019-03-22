import config from '../config';

const ChapterApiService = {
  getChapters() {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`${config.API_ENDPOINT}/chapters`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
}

export default ChapterApiService;