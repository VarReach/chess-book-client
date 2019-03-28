import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CompletedPreview from './CompletedPreview';
import './ChapterPreview.css';
import BooksContext from '../../contexts/BooksContext';

class ChapterPreview extends Component {
  static contextType = BooksContext;

  render() {
    const { chapter, index } = this.props;
    const bookId = this.context.bookId;
    return (
      <Link to={`/book/${bookId}/chapter/${index+1}`} className={'chapter-preview' + (this.props.date ? ' completed-chapter' : '')}>
        {this.props.date && <CompletedPreview chapterId={chapter.id} date={this.props.date}/>}
        <div className="chapter-preview__chapter-details">
          <span className="chapter-preview__chapter-index">{`Chapter ${index+1}`}</span>
          <h2>{chapter && chapter.title}</h2>
        </div>
      </Link>
    );
  }
}

export default ChapterPreview