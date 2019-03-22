import React, { Component } from 'react'
import ci from '../../helpers/contentInterpreter';
import ArticleContext from '../../contexts/ArticleContext';
import ArticleApiService from '../../services/article-api-service';

class ArticlePage extends Component {
  static contextType = ArticleContext;

  componentDidMount() {
    const { chapterIndex, articleIndex } = this.props.match.params;
    ArticleApiService.getArticle(chapterIndex, articleIndex)
    .then(resp => {
      this.context.setArticle(resp);
    })
    .catch(err => {
      this.context.setError(err);
    });
  }

  componentWillUnmount() {
    this.context.clearArticle();
  }

  renderContent = (content) => {
    return ci.checkContent(content);
  }

  render() {
    return (
      <article>
        <h1>{this.context.article.title}</h1>
        {this.context.article.content && this.renderContent(this.context.article.content)}
      </article>
    );
  }
}

export default ArticlePage
