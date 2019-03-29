import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import './ChapterPreview.css';
import helpers from '../../../helpers/misc-helpers';
import EditorBookContext from '../../../contexts/EditorBookContext';

class ChapterPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChapterInfo: null,
    }
    this.chapterInfo = React.createRef();
  }

  static defaultProps = {
    chapter: {},
  }
  static contextType = EditorBookContext;

  handleDeleteChapterOnClick = (e) => {
    e.preventDefault();
    this.props.handleDeleteChapter(this.props.chapter.id);
  }

  handleEditChapterOnClick = (e) => {
    e.preventDefault();
    this.props.showEditChapterForm(this.props.chapter.id)
  }

  toggleChapterInfo = (e) => {
    if (e && this.dropDown.current.contains(e.target)) {
      return;
    }
    this.state.showChapterInfo ? this.hideChapterInfo() : this.showChapterInfo();
  }

  showChapterInfo = () => {
    this.setState({ showChapterInfo: true }, () => {document.addEventListener('click', this.hideChapterInfo)});
  }

  hideChapterInfo = () => {
    this.setState({ showChapterInfo: null }, () => {document.removeEventListener('click', this.hideChapterInfo)});
  }

  render() {
    const { chapter } = this.props;
    return (
      <Draggable draggableId={chapter.id} index={this.props.index}>
        {(provided) => (
          <div className="editor__chapter"
            {...provided.draggableProps}
            {...provided.dragHandleProps} //apply this to whatever you want the user to click on to drag it. Can be just a small section
            ref={provided.innerRef}
          >
            <div className="editor-chapter__info">
              <button onClick={this.showChapterInfo} type="button" className="info-button"><i className="fas fa-info"/></button>
              {this.state.showChapterInfo && (
                <div className="editor-chapter-info dropdown" ref={this.chapterInfo}>
                  <ul>
                    <li>Created: <span>{helpers.parseDate(chapter.date_created)}</span></li>
                    {chapter.date_published && <li>Published: <span>{helpers.parseDate(chapter.date_published)}</span></li>}
                    {chapter.date_modified && <li>Last modified: <span>{helpers.parseDate(chapter.date_modified)}</span></li>}
                  </ul>
                </div>)}
              <Link to={`/editor/chapters/${chapter.id}`}><h3>{chapter.title}</h3></Link>        
            </div>
            <div className="editor-chapter__button-holder">
              <button onClick={this.handleEditChapterOnClick}><i className="fas fa-ellipsis-h"/></button>
              <button onClick={this.handleDeleteChapterOnClick}><i className="fas fa-trash"/></button>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

export default ChapterPreview