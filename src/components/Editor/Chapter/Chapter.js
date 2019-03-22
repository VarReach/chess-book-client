import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import ChaptersEditorContext from '../../../contexts/ChaptersEditorContext';
import EditorApiService from '../../../services/editor-api-service';

class Chapter extends Component {
  static contextType = ChaptersEditorContext;

  handleDeleteChapter = (chapterId) => {
    EditorApiService.deleteChapter(chapterId)
      .then(() => {
        EditorApiService.getChapters()
          .then(resp => {
            this.context.setChapters(resp);
          })
          .catch(err => {
            this.context.setError(err);
          });
      });
  }

  render() {
    return (
      <Draggable draggableId={this.props.chapter.id} index={this.props.index}>
        {(provided) => (
          <div className="chapter"
            {...provided.draggableProps}
            {...provided.dragHandleProps} //apply this to whatever you want the user to click on to drag it. Can be just a small section
            ref={provided.innerRef}
          >
            <h1>{this.props.chapter.title}</h1>
            <button onClick={()=>this.context.showEditChapterForm(this.props.chapter.id)}>Edit</button>
            <button onClick={()=>this.handleDeleteChapter(this.props.chapter.id)}>Delete</button>
          </div>
        )}
      </Draggable>
    )
  }
}

export default Chapter