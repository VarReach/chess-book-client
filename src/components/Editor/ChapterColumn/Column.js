import React, { Component } from 'react';
import Chapter from '../Chapter/Chapter';
import { Droppable } from 'react-beautiful-dnd';
import './Column.css';

class Column extends Component {
  getChapters = () => {
    return this.props.chapters.map((chapter,i) => {
      return <Chapter key={chapter.id} index={i} chapter={chapter} handleDeleteChapter={this.props.handleDeleteChapter} showEditChapterForm={this.props.showEditChapterForm}/>
    })
  }

  render() {
    return (
      <div>
        <h2>{this.props.column.title}</h2>
        <Droppable droppableId={this.props.column.id}>
          {(provided) => (
            <div className="editor__chapter-column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.props.chapters && this.getChapters()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default Column;
