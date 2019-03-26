import React, { Component } from 'react';
import './ChapterPreview.css';
import UserContext from '../../contexts/UserContext';
import helpers from '../../helpers/misc-helpers';

class CompletedPreview extends Component {
  static contextType = UserContext;

  getCompletedChapterIds = () => {
    const chapterId = this.props.chapterId;
    const { completed_chapters } = this.context.user;
    if (completed_chapters && chapterId) {
      const completedChapters = completed_chapters.map(cc => cc.id);
      const index = completedChapters.indexOf(chapterId);
      if (index !== -1) {
        let date = completed_chapters[index].date_completed;
        date = helpers.parseDate(date);
        return (
          <>
            <div className="chapter-preview__completion-indicator">
              <span>completed</span>
            </div>
            <div className="chapter-preview__completed-date">
              <span >
                {date}
              </span>
            </div>
          </>
        );
      }
    }
  }

  render() {
    return (
      <>
        {this.getCompletedChapterIds()}
      </>
    )
  }
}

export default CompletedPreview;