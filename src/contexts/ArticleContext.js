import React, { Component } from 'react'

const nullArticle = {
  title: null,
  content: [],
}

const ArticleContext = React.createContext({
  totalArticles: null,
  article: nullArticle,
  error: null,
  setArticle: () => {},
  clearArticle: () => {},
  setError: () => {},
})

export default ArticleContext;

export class ArticleProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalArticles: null,
      article: nullArticle,
      error: null,
      setArticle: this.setArticle,
      clearArticle: this.clearArticle,
      setError: this.setError
    };
  }

  setArticle = (resp) => {
    this.setState({ 
      article: {
        title: resp.title,
        content: resp.content,
      },
      totalArticles: resp.total_articles,
    });
  }

  clearArticle = () => {
    this.setState({
      article: nullArticle,
      totalArticles: null,
    })
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <ArticleContext.Provider value={this.state}>
        {this.props.children}
      </ArticleContext.Provider>
    )
  }
}
