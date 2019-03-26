import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import './ChapterPreview.css';
import EditorBookContext from '../../../contexts/EditorBookContext';

class ChapterPreview extends Component {
  static contextType = EditorBookContext;

  handleDeleteChapterOnClick = (e) => {
    e.preventDefault();
    this.props.handleDeleteChapter(this.props.chapter.id);
  }

  handleEditChapterOnClick = (e) => {
    e.preventDefault();
    this.props.showEditChapterForm(this.props.chapter.id)
  }

  render() {
    return (
      <Draggable draggableId={this.props.chapter.id} index={this.props.index}>
        {(provided) => (
          <div className="editor__chapter"
            {...provided.draggableProps}
            {...provided.dragHandleProps} //apply this to whatever you want the user to click on to drag it. Can be just a small section
            ref={provided.innerRef}
          >
            <Link to={`/editor/chapters/${this.props.chapter.id}`}><h3>{this.props.chapter.title}</h3></Link>
            <button onClick={this.handleEditChapterOnClick}>Edit</button>
            <button onClick={this.handleDeleteChapterOnClick}>Delete</button>
          </div>
        )}
      </Draggable>
    )
  }
}

export default ChapterPreview