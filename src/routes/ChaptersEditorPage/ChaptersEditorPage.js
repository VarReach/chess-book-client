import React, { Component } from 'react'
import ChaptersEditorContext from '../../contexts/ChaptersEditorContext';
import EditorApiService from '../../services/editor-api-service';
import Column from '../../components/Editor/ChapterColumn/Column';
import NewChapterForm from '../../components/Editor/NewChapterForm/NewChapterForm';
import EditChapterForm from '../../components/Editor/EditChapterForm/EditChapterForm';
import { DragDropContext } from 'react-beautiful-dnd';

class ChaptersEditorPage extends Component {
  state = {
    showNewChapterForm: false,
  }

  static contextType = ChaptersEditorContext;

  componentDidMount() {
    EditorApiService.getChapters()
      .then(resp => {
        this.context.setChapters(resp);
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    //make sure there's a destination
    if (!destination) {
      return;
    }
    //check if destination is source for both table and index
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    //pull the source and the destination columns;
    const sourceColumn = this.context.columns[source.droppableId];
    const destinationColumn = this.context.columns[destination.droppableId];
    //lets just do move from one to the other for now...
    //if its the same source as destination, we just need to update the ids in each columns 'chapterIds' array
    let newChapterIds;
    if (source.droppableId === destination.droppableId) {
      newChapterIds = Array.from(sourceColumn.chapterIds);
      newChapterIds.splice(source.index, 1);
      newChapterIds.splice(destination.index, 0, draggableId);
    } else {
      //need to update both old and new columns
      newChapterIds = Array.from(destinationColumn.chapterIds);
      newChapterIds.splice(source.index, 1);
      newChapterIds.splice(destination.index, 0, draggableId);
    }
    this.context.updateColumnChapterIds(destination.droppableId, newChapterIds)
  }

  getColumns = () => {
    return Object.keys(this.context.columns).map(key => {
      const column = this.context.columns[key];
      const chapters = column.chapterIds.map(chapterId => this.context.chapters[chapterId]);

      return <Column key={column.id} column={column} chapters={chapters}/>;
    });
  }

  handleCreateNewChapter = (e) => {
    e.preventDefault();
    const { title } = e.target;
    this.createNewChapter(title.value)
      .then(() => {
        title.value = '';
        this.setState({ showNewChapterForm: false });
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  findNextChapterIndex = () => {
    return Object.keys(this.context.chapters).length+1;
  }

  createNewChapter = (title) => {
    const newIndex = this.findNextChapterIndex();
    return EditorApiService.createNewChapter({ 
      title, 
      index: newIndex 
    })
      .then(res => {
        this.context.insertChapter(res)
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  showNewChapterForm = () => {
    this.setState({ showNewChapterForm: true });
  }

  handleEditChapter = (e) => {
    e.preventDefault();
    const { title } = e.target;
    EditorApiService.updateChapter(this.context.editing, { title: title.value })
      .then(res => {
        this.context.updateChapter(this.context.editing, res);
      })
      .then(() => {
        this.context.hideEditChapterForm();
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.getColumns()}
        {this.context.editing && <EditChapterForm handleEditChapter={this.handleEditChapter} title={this.context.chapters[this.context.editing].title}/>}
        {this.state.showNewChapterForm && <NewChapterForm handleCreateNewChapter={this.handleCreateNewChapter}/>}
        <button onClick={this.showNewChapterForm}>Create new chapter</button>
        <button onClick={this.publishChanges}>Save Changes</button>
      </DragDropContext>
    );
    
  }
}

export default ChaptersEditorPage