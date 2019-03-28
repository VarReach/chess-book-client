import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import NextButton from './NextButton';

export default class ChapterControls extends Component {
  static contextType = UserContext;

  state = {
    showScrollButton: null,
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
      this.setState({ showScrollButton: true });
    } else {
      this.setState({ showScrollButton: null });
    }
  }

  scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  render() {
    return (
      <div className="article__chapter-controls">
        <div className="article__chapter-buttons-holder">
          {this.props.chapterIndex === 1
            ? <button disabled={true}><i className='fas fa-angle-double-left'/></button>
            : <Link 
                to={`/book/${this.props.bookId}/chapter/1`} 
                onClick={(e) => this.props.handleControlsOnClick(e, this.props.bookId, 1)}>
                  <i className='fas fa-angle-double-left'/>
              </Link>}
          {this.props.chapterIndex === 1
            ? <button disabled={true}><i className='fas fa-angle-left'/></button>
            : <Link 
                to={`/book/${this.props.bookId}/chapter/1`} 
                onClick={(e) => this.props.handleControlsOnClick(e, this.props.bookId, this.props.chapterIndex - 1)}>
                  <i className='fas fa-angle-left'/>
              </Link>}
          <NextButton bookId={this.props.bookId} chapterId={this.props.chapterId} chapterIndex={this.props.chapterIndex} handleOnClick={this.props.handleControlsOnClick} />
        </div>
        {this.state.showScrollButton && <button onClick={this.scrollToTop}><i className="far fa-arrow-alt-circle-up"/></button>}
      </div>
    )
  }
}