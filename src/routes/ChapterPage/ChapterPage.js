import React, { Component } from 'react'
import ChapterContext from '../../contexts/ChapterContext';
import { convertToHTML } from 'draft-convert';
import { editorStateFromRaw } from 'megadraft';
import parse from 'html-react-parser';
import Chessboard from '../../components/ArticleEditor/Components/Chessboard';
import ChapterApiService from '../../services/chapter-api-service';
import { Link } from 'react-router-dom';
import ChapterControls from '../../components/ChapterControls/ChapterControls';
import Loading from '../../components/Loading/Loading';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './ChapterPage.css';

export default class ChapterPage extends Component {
  state = {
    loading: true,
    chapterNotFound: null,
  }

  static contextType = ChapterContext;
  static defaultProps = {
    match: {
      url: '',
      params: {
        chapterIndex: '',
      }
    },
  };

  componentDidMount() {
    const { bookId, chapterIndex } = this.props.match.params;
    ChapterApiService.getChapterByBookIdAndChapterIndex(bookId, chapterIndex)
      .then((chapter) => {
        this.context.setChapter(chapter, this.finishLoading);
      })
      .catch(err => {
        if (err.error && err.error.includes('doesn\'t exist')) {
          this.setState({ chapterNotFound: true, loading: null });
        }
        this.context.setError(err);
      });
  }

  componentWillUnmount() {
    this.context.clearChapter();
  }

  finishLoading = () => {
    this.setState({ loading: null });
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
      this.props.history.push(`/?book=${bookId}`);
    } else {
      this.setState({ loading: true }, () => {
        ChapterApiService.getChapterByBookIdAndChapterIndex(bookId, chapterIndex)
          .then((chapter) => {
            this.context.setChapter(chapter, this.finishLoading);
            this.props.history.push(`/book/${bookId}/chapter/${chapterIndex}`);
          })
          .catch(err => {
            console.error(err);
            this.context.setError(err);
          });
      });
    }
  }

  render() {
    const bookId = this.props.match.url.split('/')[2];
    const chapter = this.context.chapter;
    const chapterIndex = parseInt(this.props.match.params.chapterIndex);
    if (this.state.loading) {
      return <Loading status={this.context.error}/>;
    }
    if (this.state.chapterNotFound) {
      return <NotFoundPage />
    }
    return (
      <>
        <article className="article-container">
          <header className="article__header">
            <span><Link to={`/?book=${bookId}`}>{chapter.book_title}</Link> | Chapter {chapterIndex}</span>
            <h1>{chapter.title}</h1>
          </header>
        {this.renderHTML()}
        {(chapterIndex && chapter && this.context.lastChapterAvailable) && 
          <ChapterControls 
            chapterId={chapter.id} 
            chapterIndex={chapterIndex} 
            bookId={bookId}
            handleControlsOnClick={this.handleControlsOnClick}
          />}
        </article>
      </>
      
    )
  }
}
