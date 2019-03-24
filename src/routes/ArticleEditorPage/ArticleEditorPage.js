import React, { Component } from 'react'
import Chapter from '../../components/Chapter/Chapter';
import queryString from 'query-string';
import ArticleEditor from '../../components/ArticleEditor/ArticleEditor';
// import EditorArticleApiService from '../../services/editor-article-api-service';
import '../../../node_modules/megadraft/dist/css/megadraft.css';

class ArticleEditorPage extends Component {
  state = {
    fetching: false,
    article: {},
  }

  componentDidMount() {
    this.getArticle();
  }

  getArticle = () => {
    // const id = this.props.match.params.articleId;
    // EditorArticleApiService.getArticle(id)
    //   .then(resp => {
    //     this.setState({ article: resp });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  render() {
    return (
      <section className='editer__article-editor-holder'>
        {this.state.article.content && <ArticleEditor content={this.state.article.content} saveChanges={this.saveChanges}/>}
      </section>
    );
  }
}

export default ArticleEditorPage
