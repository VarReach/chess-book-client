import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CompletedPreview from './CompletedPreview';
import './ChapterPreview.css';
import ChaptersContext from '../../contexts/ChaptersContext';


class ChapterPreview extends Component {
  static contextType = ChaptersContext;

  render() {
    const chapter = this.context.chapters[this.props.index];
    return (
      <div className="chapter-preview">
        <CompletedPreview chapterId={chapter.id}/>
        <div className="chapter-preview__chapter-details">
          <span className="chapter-preview__chapter-index">{`Chapter ${this.props.index+1}`}</span>
          <h2><Link to={`/book/${this.context.bookId}/chapter/${this.props.index+1}`}>{chapter.title}</Link></h2>
        </div>
      </div>
    )
  }
}

export default ChapterPreview