import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import ChaptersEditorContext from '../../../contexts/ChaptersEditorContext';
import EditorApiService from '../../../services/editor-api-service';
import './Chapter.css';

class Chapter extends Component {
  static contextType = ChaptersEditorContext;

  handleDeleteChapter = (chapter) => {
    this.props.handleDeleteChapter(chapter.id);
  }

  handleEditChapter = (chapter) => {
    this.props.showEditChapterForm(chapter.id);
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
            <h3>{this.props.chapter.title}</h3>
            <button onClick={()=>this.handleEditChapter(this.props.chapter)}>Edit</button>
            <button onClick={()=>this.handleDeleteChapter(this.props.chapter)}>Delete</button>
          </div>
        )}
      </Draggable>
    )
  }
}

export default Chapter