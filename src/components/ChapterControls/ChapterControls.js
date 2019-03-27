import React, { Component } from 'react';
import ChapterContext from '../../contexts/ChapterContext';
import { Link } from 'react-router-dom';
import NextButton from './NextButton';


export default class ChapterControls extends Component {
  state = {
    fetching: false,
  }

  static contextType = ChapterContext;

  goToFirstChapter = () => {
    const path = this.props.match.url.slice(0, 16);
    this.props.history.push(`${path}1`);
  }

  goToPrevChapter = (e) => {
    const path = this.props.match.url.slice(0, 16);
    this.props.history.push(`${path}${e.target.value-1}`);
  }

  getLinkOrButton = (path, disabled, targetIndex, iClass, value) => {
    if (disabled) {
      return <button disabled={true} className="article__chapter-controls"><i className={iClass}/></button>
    }
    return <Link to={path+targetIndex} onClick={this.handleOnClick} className="article__chapter-controls" data-direction={value}><i className={iClass}/></Link>;
  }

  redirectAndLoadChapter = (bookId, chapterIndex) => {
    this.context.getChapter(bookId, chapterIndex);
    this.props.history.push(`/book/${bookId}/chapter/${chapterIndex}`);
  }

  handleOnClick = (e) => {
    e.preventDefault();
    const value = e.target.getAttribute('data-direction');
    let chapterIndex;
    switch (value) {
      case 'first': 
        chapterIndex = 1;
        break;
      case 'prev':
        chapterIndex = this.props.chapterIndex - 1;
        break;
    }
    this.redirectAndLoadChapter(this.props.bookId, chapterIndex);
  }

  //some prop drilling here due to context overlaps due to needing to update completed chapters in the NextButton component
  getChapterLinks = () => {
  
    const bookId = this.props.bookId;
    const path = `/book/${bookId}/chapter/`;
    const chapterIndex = this.props.chapterIndex;
    const chapter = this.context.chapter;
    const lastChapterAvailable = chapter.last_chapter_available;
    return (
      <div className="article__chapter-buttons-holder">
        {this.getLinkOrButton(path, chapterIndex === 1, 1, 'fas fa-angle-double-left', 'first')}
        {this.getLinkOrButton(path, chapterIndex === 1, chapterIndex - 1, 'fas fa-angle-left', 'prev')}
        <NextButton onClick={this.handleOnClick} chapterIndex={chapterIndex} lastChapterAvailable={lastChapterAvailable} path={path} id={chapter.id}/>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.getChapterLinks()}
      </>
    )
  }
}