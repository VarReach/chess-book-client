import React, { Component } from 'react'
import ChaptersEditorContext from '../../contexts/ChaptersEditorContext';
import EditorApiService from '../../services/editor-api-service';
import Column from '../../components/Editor/ChapterColumn/Column';
import NewChapterForm from '../../components/Editor/NewChapterForm/NewChapterForm';
import EditChapterForm from '../../components/Editor/EditChapterForm/EditChapterForm';
import { DragDropContext } from 'react-beautiful-dnd';
import { Prompt } from 'react-router';

let changes = {
  deletions: [],
  creations: [],
  published: [],
  unpublished: [],
  titles: {},
  positions: {},
};

class ChaptersEditorPage extends Component {
  state = {
    fetching: false,
    newChapterForm: false,
    blockNavigation: false,
    editing: null,
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

  componentDidUpdate() {
    if (this.context.blockNavigation) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
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
    //pull the source column, as we'll always need it.
    const sourceColumn = this.context.columns[source.droppableId];
    const destinationColumn = this.context.columns[destination.droppableId];


    //lets just do move from one to the other for now...
    //if its the same source as destination, we just need to update the ids in each columns 'chapterIds' array
    if (source.droppableId === destination.droppableId) {
      const newChapterIds = Array.from(sourceColumn.chapterIds);
      newChapterIds.splice(source.index, 1);
      newChapterIds.splice(destination.index, 0, draggableId);

      this.context.updateColumnChapterIds(
        source.droppableId,
        newChapterIds,
        this.checkIfChangedColumnIndexes
      );

    } else {

      const sourceChapterIds = Array.from(sourceColumn.chapterIds);
      sourceChapterIds.splice(source.index, 1);
      const destinationChapterIds = Array.from(destinationColumn.chapterIds);
      destinationChapterIds.splice(destination.index, 0, draggableId);

      this.context.updateColumnsChapterIds(
        source.droppableId, 
        destination.droppableId, 
        sourceChapterIds,
        destinationChapterIds,
        this.checkIfChangedColumnsIndexes
      );
    }
  }

  checkIfChanged = () => {
    let blockNavigation = false;
    for (const [_, value] of Object.entries(changes)) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          blockNavigation = true;
          break;
        }
      } else {
        if (Object.keys(value).length > 0) {
          blockNavigation = true;
          break;
        }
      }
    }
    this.setState({ blockNavigation }, () => console.log(this.state.blockNavigation, changes));
  }

  resetChanges = () => {
    changes = {
      deletions: [],
      creations: [],
      published: [],
      unpublished: [],
      titles: {},
      positions: {},
    };
    this.checkIfChanged();
  }

  
  checkIfChangedTitles = (chapterId, newTitle) => {
    //compare the new title versus the chapters
    if (this.context.chapters[chapterId].title === newTitle) {
      (changes.titles[chapterId] && delete changes.titles[chapterId]);
    } else {
      changes.titles[chapterId] = newTitle;
    }
    this.checkIfChanged();
  }

  checkIfChangedDeleted = (chapterId, columnId) => {
    //check if the chapter is in the creations array
    const creationsIndex = changes.creations.indexOf(chapterId);
    if (creationsIndex !== -1) {
      changes.creations.splice(creationsIndex, 1);
    } else {
      changes.deletions.push(chapterId);
    }
    //check if the chapter is in the titles array, remove if so
    changes.titles[chapterId] && delete changes.titles[chapterId];
    //check if the chapter is in the positions array, remove if so
    changes.positions[chapterId] && delete changes.positions[chapterId];
    //check if in either of the published arrays and remove if so
    const pIndex = changes.published.indexOf(chapterId);
    (pIndex !== -1) && changes.published.splice(pIndex, 1);
    const uPIndex = changes.unpublished.indexOf(chapterId);
    (uPIndex !== -1) && changes.unpublished.splice(uPIndex, 1);
    //update any indexes that may have been changed
    if (columnId === 'wipChapters') {
      this.updateColumnIndexes(columnId, this.state.columns[columnId].chapterIds);
    } else if (columnId === 'publishedChapters') {
      this.updateColumnsIndexes(
        [columnId, 'wipChapters'], 
        [this.state.columns[columnId].chapterIds, 
        this.state.columns['wipChapters'].chapterIds]
      );
    }
    this.checkIfChanged();
  }

  checkIfChangedCreated = (newChapterId) => {
    changes.creations.push(newChapterId);
    this.checkIfChanged();
  }

  removeFromPublished = (id) => {
    const pIndex = changes.published.indexOf(id);
    (pIndex !== -1) && changes.published.splice(pIndex, 1);
  }

  removeFromUnpublished = (id) => {
    const uPIndex = changes.unpublished.indexOf(id);
    (uPIndex !== -1) && changes.unpublished.splice(uPIndex, 1);
  }

  checkIfChangedColumnIndexes = (columnId, newChapterIds) => {
    //if the column is WIP, need to add publishedChapters length to indexes
    let iAdjust = 1;
    (columnId === 'wipChapters') && (iAdjust += this.context.columns.publishedChapters.chapterIds.length);
    newChapterIds.forEach((id,i) => {
      //if the new ID does not equal the backed up index
      if (i+iAdjust === this.context.chapters[id].index) {
        (changes.positions[id] && delete changes.positions[id]);
      } else {
        changes.positions[id] = i + iAdjust;
      }
    });
    this.checkIfChanged();
  }

  checkIfChangedColumnsIndexes = (ids, chapterIds) => {
    let iAdjust = 1;
    chapterIds.forEach((arr, i) => {
      
      (ids[i] === 'wipChapters') 
        ? iAdjust += chapterIds[1 - i].length
        : iAdjust = 1;

      arr.forEach((id,ii) => {
        //check actual index against backup index
        if (ii+iAdjust === this.context.chapters[id].index) {
          (changes.positions[id] && delete changes.positions[id]);
        } else {
          changes.positions[id] = ii + iAdjust;
        }

        const published = this.context.chapters[id].published;
        if (ids[i] === 'publishedChapters') {
          (published)
            ? this.removeFromUnpublished(id)
            : changes.published.push(id);
        } else {
          (published)
            ? changes.unpublished.push(id)
            : this.removeFromPublished(id);
        }
      });
    });
    this.checkIfChanged();
  }

  handleDiscardChanges = (e) => {
    e.preventDefault();
    //check if there are no changes to be made
    if (!this.state.blockNavigation) {
      console.error('no changes');
      return;
    }

    if (this.state.fetching) {
      console.error('already fetching');
      return;
    }

    EditorApiService.getChapters()
      .then(resp => {
        this.context.setChapters(resp);
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  handleSaveChanges = (e) => {
    e.preventDefault();
    //check if there are no changes to be made
    if (!this.state.blockNavigation) {
      console.error('no changes');
      return;
    }

    if (this.state.fetching) {
      console.error('already fetching');
      return;
    }
    
    const deleteRequests = changes.deletions.map(id => {
      return EditorApiService.deleteChapter(id);
    });

    const createRequests = changes.creations.map(id => {
      const newChapter = {...this.context.chapters[id]};
      delete newChapter.id;
      return EditorApiService.createNewChapter(newChapter);
    });

    //create the updatedObjects from the positions, titles and (un)published elements
    let patchObjects = {};
    //grab all updated positions
    for (let [id,value] of Object.entries(changes.positions)) {
      //create chapter object is doesn't exist
      !patchObjects[id] && (patchObjects[id] = {});
      patchObjects[id].index = value;
    }
    //grab all updated titles
    for (let [id, value] of Object.entries(changes.titles)) {
      !patchObjects[id] && (patchObjects[id] = {});
      patchObjects[id].title = value;
    }
    //grab all publishing status changes
    for (let id of changes.published) {
      !patchObjects[id] && (patchObjects[id] = {});
      patchObjects[id].published = true;
    }
    for (let id of changes.unpublished) {
      !patchObjects[id] && (patchObjects[id] = {});
      patchObjects[id].published = false;
    }
    const patchRequests = Object.keys(patchObjects).map(id => {
      console.log(id, patchObjects[id]);
      return EditorApiService.updateChapter(id, patchObjects[id]);
    });
    //prevent multiple requests, or discarding changes before they go through
    this.setState({ fetching: true }, () => {
      //handle all creation/deletion requests
      Promise.all([
        ...deleteRequests,
        ...createRequests
      ])
        .then(() => {
          Promise.all(patchRequests)
            //get updated DOM, reset the changes object and state 
            .then(() => { 
              EditorApiService.getChapters()
                .then(resp => {
                  this.context.setChapters(resp, () => {
                    this.resetChanges();
                    this.setState({ fetching: false });
                  });
                })
                .catch(err => {
                  this.setState({ fetching: false });
                  this.context.setError(err);
                });
            });
        });
    });
  }

  handleCreateChapter = (e) => {
    e.preventDefault();
    const { title } = e.target;
    this.context.createChapter(title.value, this.checkIfChangedCreated);
    this.hideNewChapterForm();
  }

  handleEditChapter = (e) => {
    e.preventDefault();
    const { title } = e.target;
    this.context.changeChapterTitle(this.state.editing, title.value, () => {
      this.checkIfChangedTitles(this.state.editing, title.value);
      this.hideEditChapterForm();
    });
  }

  handleDeleteChapter = (chapterId) => {
    this.context.deleteChapter(chapterId, () => {
      this.checkIfChangedDeleted(chapterId);
    });
  }

  showNewChapterForm = () => {
    this.setState({ newChapterForm: true });
  }

  hideNewChapterForm = () => {
    this.setState({ newChapterForm: false });
  }

  showEditChapterForm = (chapterId) => {
    this.setState({ editing: chapterId });
  }

  hideEditChapterForm = () => {
    this.setState({ editing: null });
  }

  getColumns = () => {
    return Object.keys(this.context.columns).map(key => {
      const column = this.context.columns[key];
      const chapters = column.chapterIds.map(chapterId => this.context.chapters[chapterId]);

      return <Column key={column.id} column={column} chapters={chapters} handleDeleteChapter={this.handleDeleteChapter} showEditChapterForm={this.showEditChapterForm}/>;
    });
  }

  render() {
    return (
      <>
        <Prompt
          when={this.context.blockNavigation}
          message='You have unsaved changes'
        />
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.getColumns()}
          {this.state.editing && <EditChapterForm handleEditChapter={this.handleEditChapter} title={this.context.chapters[this.state.editing].title}/>}
          {this.state.newChapterForm && <NewChapterForm handleCreateNewChapter={this.handleCreateChapter}/>}
          <button onClick={this.showNewChapterForm}>Create new chapter</button>
          <button onClick={this.handleSaveChanges}>Save Changes</button>
          <button onClick={this.handleDiscardChanges}>Discard Changes</button>
        </DragDropContext>
      </>
    );
    
  }
}

export default ChaptersEditorPage