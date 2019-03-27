import React from 'react';
import { Link } from 'react-router-dom';
import CompletedPreview from './CompletedPreview';
import './ChapterPreview.css';


function ChapterPreview(props) {
  const { chapter, bookId, index } = props;
  return (
    <div className="chapter-preview">
      <CompletedPreview chapterId={chapter.id}/>
      <div className="chapter-preview__chapter-details">
        <span className="chapter-preview__chapter-index">{`Chapter ${index+1}`}</span>
        <h2><Link to={`/book/${bookId}/chapter/${index+1}`}>{chapter.title}</Link></h2>
      </div>
    </div>
  )
}

export default ChapterPreview