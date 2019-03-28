import React from 'react';
import './ChapterPreview.css';

function CompletedPreview(props){
  return (
    <>
      <div className="chapter-preview__completion-indicator">
        <span>completed</span>
      </div>
      <div className="chapter-preview__completed-date">
        <span >
          {props.date}
        </span>
      </div>
    </>
  )
}

export default CompletedPreview;