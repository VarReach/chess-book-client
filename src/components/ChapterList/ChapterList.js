import React, { Component } from 'react';
import ChapterPreview from '../ChapterPreview/ChapterPreview';
import UserContext from '../../contexts/UserContext';
import helpers from '../../helpers/misc-helpers';

class CompletedPreview extends Component {
  static contextType = UserContext;

  getCompletedChapterIds = (chapterId, completedChapters, completed_chapters) => {
    if (completedChapters && chapterId) {
      const index = completedChapters.indexOf(chapterId);
      if (index !== -1) {
        let date = completed_chapters[index].date_completed;
        date = helpers.parseDate(date);
        return date;
      }
    }
  }

  renderChapters = () => {
    let completedChapters;
    let completed_chapters;
    if (this.context && this.context.user) {
      completed_chapters = this.context.user.completed_chapters;
      completedChapters = completed_chapters ? completed_chapters.map(cc => cc.id) : null;
    }
    return this.props.chapters.map((chapter, i) => {
      const date = this.getCompletedChapterIds(chapter.id, completedChapters, completed_chapters);
      return (
        <ChapterPreview key={i} index={i} chapter={chapter} date={date}/>
      )
    });
  }

  render() {
    return (
      <section className="container">
        {this.props.chapters && this.renderChapters()}
      </section>
    )
  }
}

export default CompletedPreview;