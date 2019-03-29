import React, { Component } from 'react'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import { Link } from 'react-router-dom';
import EditorChaptersApiService from '../../services/editor-chapters-api-service';
import ChessboardPlugin from '../../components/ArticleEditor/Plugins/Chessboard';
import Loading from '../../components/Loading/Loading';
import '../../../node_modules/megadraft/dist/css/megadraft.css';
import './EditorChapterPage.css';

let backup;

class EditorChapterPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      chapter: {},
      error: null,
      editorState: null,
      blockNavigation: null,
    };
  }

  static defaultProps = {
    match: {
      params: {}
    }
  }

  componentDidMount() {
    const id = this.props.match.params.chapterId;
    EditorChaptersApiService.getChapterById(id)
      .then(chapter => {
        this.setState({ 
          chapter,
          editorState: editorStateFromRaw(chapter.content),
          loading: null,
        });
        backup = editorStateToJSON(editorStateFromRaw(chapter.content));
      })
      .catch(err => {
        this.setState({ error: err });
      });
  }

  componentDidUpdate() {
    if (this.state.blockNavigation) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  onChange = (editorState) => {
    const newState = {
      editorState,
      blockNavigation: (editorStateToJSON(editorState) !== backup)
    };
    this.setState(newState);
  }

  onSaveClick = () => {
    const {editorState} = this.state;
    const content = editorStateToJSON(editorState);
    EditorChaptersApiService.updateChapter(
      this.props.match.params.chapterId,
      { content }
    )
      .then(() => {
        this.setState({ blockNavigation: null });
        backup = content;
      })
      .catch(err => {
        this.setState({ error: err });
      });
  }

  render() {
    const chapter = this.state.chapter;
    if (this.state.loading) {
      return <Loading status={this.state.error} />
    }
    return (
      <>
        <header className="article__header">
          <span><Link to={`/editor/books/${chapter.book_id}`}><i className="fas fa-book-open"/>Chapter List</Link> | Chapter {chapter.id}</span>
        </header>
        <article className="article-editor article-container">
          <h1>{this.state.chapter.title}</h1>
          <section className='editer__article-editor-holder'>
            {this.state.editorState && <MegadraftEditor
              editorState={this.state.editorState}
              onChange={this.onChange}
              spellCheck="true"
              plugins={[ChessboardPlugin]}
            />}
            <div className="editor-book-page__button-holder">
              <button disabled={!this.state.blockNavigation} onClick={this.onSaveClick}><i className="fas fa-save"/></button>
            </div>  
          </section>
        </article>
      </>
    );
  }
}

export default EditorChapterPage
