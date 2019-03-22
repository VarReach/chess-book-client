import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Chapter extends Component {
  renderArticles = () => {
    return this.props.chapter.articles.map((article, i) => {
      return (
        <h2 key={i}><Link to={'chapters/'+this.props.chapter.index+'/articles/'+(i+1)}>{article.title}</Link></h2>
      );
    });
  }

  render() {
    return (
      <>
        <div className="chapter">
          <h1>{this.props.chapter.title}</h1>
        </div>
        {this.renderArticles()}
      </>
    )
  }
}

export default Chapter
