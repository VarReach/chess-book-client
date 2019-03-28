import config from '../config';
import TokenService from './token-service';
import IdleService from './idle-service';

const AuthApiService = {
  getUserInfo() {
    const options = {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    };
    return fetch(`${config.API_ENDPOINT}/users`, options)
      .then(res => {
        return (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      });
  },
  postLogin(credentials) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    return fetch(`${config.API_ENDPOINT}/auth/login`, options)
      .then(res => {
        return (!res.ok) 
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      })
      .then(res => {
        TokenService.saveAuthToken(res.authToken);
        IdleService.registerIdleTimerResets();
        TokenService.queueCallbackBeforeExpiry(() => {
          AuthApiService.postRefreshToken();
        });
        return res;
      });
  },
  postUser(user) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user),
    };
    return fetch(`${config.API_ENDPOINT}/users`, options)
      .then(resp => {
        return (!resp.ok)
          ? resp.json().then(e => Promise.reject(e))
          : resp.json();
      });
  },
  postRefreshToken() {
    const options = {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    };
    return fetch(`${config.API_ENDPOINT}/auth/refresh`, options)
      .then(res => {
        return (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      })
      .then(res => {
        TokenService.saveAuthToken(res.authToken);
        TokenService.queueCallbackBeforeExpiry(() => {
          AuthApiService.postRefreshToken();
        })
        return res;
      })
      .catch(err => {
        console.log('refresh token request error');
        console.error(err);
      });
  },
  postCompletedChapter(chapterId) {
    const options = {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    };
    return fetch(`${config.API_ENDPOINT}/users/completed_chapters/${chapterId}`, options)
      .then(res => {
        return (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json();
      })
      .catch(err => {
        console.log('refresh token request error');
        console.error(err);
      });
  }
}

export default AuthApiService;