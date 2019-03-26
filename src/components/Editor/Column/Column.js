import React, { Component } from 'react';
import ChapterPreview from '../ChapterPreview/ChapterPreview';
import { Droppable } from 'react-beautiful-dnd';
import './Column.css';
import EditorBookContext from '../../../contexts/EditorBookContext';

class Column extends Component {
  static contextType = EditorBookContext;

  getChapterPreviews = () => {
    const chapterIds = this.props.column.chapterIds;
    return chapterIds.map((chapterId,i) => {
      return <ChapterPreview 
        key={chapterId} 
        index={i} 
        chapter={this.context.chapters[chapterId]} 
        handleDeleteChapter={this.props.handleDeleteChapter}
        showEditChapterForm={this.props.showEditChapterForm}
      />
    })
  }

  render() {
    return (
      <div>
        <h3>{this.props.column.title}</h3>
        <Droppable droppableId={this.props.column.id}>
          {(provided) => (
            <div className="editor__chapter-column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.getChapterPreviews()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default Column;
