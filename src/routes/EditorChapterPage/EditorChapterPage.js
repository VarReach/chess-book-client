import React, { Component } from 'react'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import { Link } from 'react-router-dom';
import EditorChaptersApiService from '../../services/editor-chapters-api-service';
import ChessboardPlugin from '../../components/ArticleEditor/Plugins/Chessboard';
import '../../../node_modules/megadraft/dist/css/megadraft.css';

let backup;

class EditorChapterPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      chapter: {},
      editorState: null,
      blockNavigation: null,
    };
  }

  componentDidMount() {
    const id = this.props.match.params.chapterId;
    EditorChaptersApiService.getChapterById(id)
      .then(chapter => {
        this.setState({ 
          chapter,
          editorState: editorStateFromRaw(chapter.content)
        });
        backup = editorStateToJSON(editorStateFromRaw(chapter.content));
      })
      .catch(err => {
        console.error(err);
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
        console.error(err);
      });
  }

  handleEditChapterTitle = (e) => {
    e.preventDefault();
    const newTitle = prompt('Please enter a new name');
    EditorChaptersApiService.updateChapter(
      this.props.match.params.chapterId,
      { title: newTitle }
    )
      .then(() => {
        const newChapter = {...this.state.chapter, title: newTitle };
        this.setState({ chapter: newChapter })
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <>
        <header role="banner">
          <h2>{this.state.chapter.title}</h2>
          <Link to={`/editor/books/${this.state.chapter.book_id}`}>Chapters</Link>
          <button onClick={this.handleEditChapterTitle}>Rename Chapter</button>
        </header>
        <section className='editer__article-editor-holder'>
          {this.state.editorState && <MegadraftEditor
            editorState={this.state.editorState}
            onChange={this.onChange}
            spellCheck="true"
            plugins={[ChessboardPlugin]}
          />}
          <button disabled={!this.state.blockNavigation} onClick={this.onSaveClick}>Save Changes</button>
        </section>
      </>
    );
  }
}

export default EditorChapterPage
