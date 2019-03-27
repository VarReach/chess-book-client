import React, { Component } from 'react';
import './ChapterPreview.css';

//placeholder method from previous implementation, eventually should move into the the ChapterPreview component
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