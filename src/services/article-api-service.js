import config from '../config';
import TokenService from './token-service';
import Chapter from '../components/Chapter/Chapter';

const ArticleApiService = {
  getArticle(chapterId, articleId) {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`${config.API_ENDPOINT}/articles/${chapterId}/${articleId}`, options)
    .then(res => {
      return (!res.ok) 
        ? res.json().then(e => Promise.reject(e))
        : res.json();
    });
  },
}

export default ArticleApiService;