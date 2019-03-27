import config from '../config';

const ChapterApiService = {
  getChapterByBookIdAndChapterIndex(bookId, chapterIndex) {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`${config.API_ENDPOINT}/books/${bookId}/chapter/${chapterIndex}`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
}

export default ChapterApiService;