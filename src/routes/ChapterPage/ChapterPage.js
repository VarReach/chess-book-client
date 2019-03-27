import React, { Component } from 'react'
import ChapterContext from '../../contexts/ChapterContext';
import { convertToHTML } from 'draft-convert';
import { editorStateFromRaw } from 'megadraft';
import parse from 'html-react-parser';
import Chessboard from '../../components/ArticleEditor/Components/Chessboard';
import ChapterApiService from '../../services/chapter-api-service';
import { Link } from 'react-router-dom';
import NextButton from '../../components/ChapterControls/NextButton';
import { Redirect } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './ChapterPage.css';

export default class ChapterPage extends Component {
  state = {
    renderNotFound: false,
  }

  static contextType = ChapterContext;

  componentDidMount() {
    const { bookId, chapterIndex } = this.props.match.params;
    ChapterApiService.getChapterByBookIdAndChapterIndex(bookId, chapterIndex)
      .then(this.context.setChapter)
      .catch(err => {
        if (err.error.includes('doesn\'t exist')) {
          this.setState({ renderNotFound: true });
        }
        this.context.setError(err);
      });
  }

  componentWillUnmount() {
    this.context.clearChapter();
  }

  checkIfChessboard = (block) => {
    if (block.type === "atomic") {
      if (block.data.type === "chessboard") {
        return <div data-type={block.data.type} data-position={block.data.position}/>
      }
    }
  }

  interpBlockData = (block) => {
    if (block.type === "atomic" && block.data.type ==="chessboard") { 
      return <figure data-type="chessboard" data-position={block.data.position} data-caption={block.data.caption} data-source={block.data.source}/> 
    }
  }

  renderHTML = () => {
    const interp = {
      blockToHTML: (block) => this.interpBlockData(block),   
      entityToHTML: (entity, originalText) => {
        if (entity.type === 'LINK') {
          return <a className="article__link" href={entity.data.url}>{originalText}</a>;
        }
        return originalText;
      }
    };
    const html = convertToHTML(interp)(editorStateFromRaw(this.context.chapter.content).getCurrentContent());
    const parseInterp = { 
      replace: (domNode) => {
        const { attribs } = domNode;
        if (!attribs) return;
        if (attribs['data-type'] === "chessboard") {
          return (
            <Chessboard data={{ position: attribs['data-position'], caption: attribs['data-caption'], source: attribs['data-source'] }}/>
          )
        }
      }
    }
    return parse(
      html,
      parseInterp
    );
  }

  getLinkOrButton = (path, disabled, targetIndex, iClass, value) => {
    if (disabled) {
      return <button disabled={true} className="article__chapter-controls"><i className={iClass}/></button>
    }
    return <Link to={path+targetIndex} onClick={this.handleOnClick} className="article__chapter-controls" data-direction={value}><i className={iClass}/></Link>;
  }


  handleControlsOnClick = (e, bookId, chapterIndex) => {
    e.preventDefault();
    if (chapterIndex > this.context.lastChapterAvailable) {
      this.props.history.push('/');
    } else {
      ChapterApiService.getChapterByBookIdAndChapterIndex(bookId, chapterIndex)
        .then((chapter) => {
          this.context.setChapter(chapter);
          this.props.history.push(`/book/${bookId}/chapter/${chapterIndex}`);
        })
        .catch(err => {
          console.error(err);
          this.context.setError(err);
        });
    }
  }

  getChapterControls(chapterIndex, chapterId) {
      const bookId = this.props.match.url.split('/')[2];
      return (
        <div className="article__chapter-buttons-holder">
          {chapterIndex === 1
            ? <button disabled={true}><i className='fas fa-angle-double-left'/></button>
            : <Link 
                to={`/book/${bookId}/chapter/1`} 
                onClick={(e) => this.handleControlsOnClick(e, bookId, 1)}>
                  <i className='fas fa-angle-double-left'/>
              </Link>}
          {chapterIndex === 1
            ? <button disabled={true}><i className='fas fa-angle-left'/></button>
            : <Link 
                to={`/book/${bookId}/chapter/1`} 
                onClick={(e) => this.handleControlsOnClick(e, bookId, chapterIndex - 1)}>
                  <i className='fas fa-angle-left'/>
              </Link>}
          <NextButton bookId={bookId} chapterId={chapterId} chapterIndex={chapterIndex} handleOnClick={this.handleControlsOnClick} />
        </div>
      );
  }

  render() {
    const chapter = this.context.chapter;
    const chapterIndex = parseInt(this.props.match.params.chapterIndex);
    if (this.state.renderNotFound) {
      return <NotFoundPage />
    }
    return (
      <>
        <article className="article-container">
          <header className="article__header">
            <span>{chapter.book_title} | Chapter {chapterIndex}</span>
            <h1>{chapter.title}</h1>
          </header>
        {this.renderHTML()}
        {(chapterIndex && chapter && this.context.lastChapterAvailable) && this.getChapterControls(chapterIndex, chapter.id)}
        </article>
      </>
      
    )
  }
}
