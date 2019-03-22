import config from '../config';
import TokenService from './token-service';

const EditorApiService = {
  getChapters() {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    };
    return fetch(`${config.API_ENDPOINT}/editor/chapters`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
  updateChapter(chapterId, updatedChapter) {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(updatedChapter)
    };
    return fetch(`${config.API_ENDPOINT}/editor/chapters/${chapterId}`, options)
      .then(res => {
        return (!res.ok) 
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      });
  },
  createNewChapter(newChapter) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(newChapter)
    };
    return fetch(`${config.API_ENDPOINT}/editor/chapters`, options)
      .then(res => {
        return (!res.ok) 
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      });
  },
  deleteChapter(chapterId) {
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    };
    return fetch(`${config.API_ENDPOINT}/editor/chapters/${chapterId}`, options)
      .then(res => {
        if (!res.ok) {
          Promise.reject('Unable to delete');
        }
      });
  }
}

export default EditorApiService;