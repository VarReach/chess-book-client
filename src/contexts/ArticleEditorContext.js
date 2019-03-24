import React, { Component } from 'react'

const nullArticle = {
  id: null,
  chapter_id: null,
  title: null,
  content: {},
  date_created: null,
  date_published: null,
  date_modified: null,
}

const ArticleEditorContext = React.createContext({
  article: {},
  error: null,
  setArticle: () => {},
  clearArticle: () => {},
  setError: () => {},
})

export default ArticleEditorContext;

export class ArticleEditorProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
      error: null,
      setArticle: this.setArticle,
      setError: this.setError,
    };
  }

  setChapters = (article) => {
    this.setState({ chapters: resp.chapters, totalChapters: resp.totalChapters });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <ArticleEditorContext.Provider value={this.state}>
        {this.props.children}
      </ArticleEditorContext.Provider>
    )
  }
}
