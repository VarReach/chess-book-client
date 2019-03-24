import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import { Prompt } from 'react-router';
import EditorBookContext from '../../contexts/EditorBookContext';
import EditorBookApiService from '../../services/editor-book-api-service';
import EditorChaptersApiService from '../../services/editor-chapters-api-service';
import Column from '../../components/Editor/Column/Column';
import NewChapterForm from '../../components/Editor/NewChapterForm/NewChapterForm';
import EditChapterForm from '../../components/Editor/EditChapterForm/EditChapterForm';
import helpers from '../../helpers/misc-helpers';

//holds any changes made
let changes = {
  deletions: [],
  creations: [],
  positions: [],
  title: {},
};
let orderBackup;

class ChaptersEditorPage extends Component {
  state = {
    book: {},
    columns: {},
    chapterOrder: [],
    editing: false,
    fetching: false,
    newChapterForm: false,
    blockNavigation: false,
  }

  static contextType = EditorBookContext;

  componentDidMount() {
    this.getChapters();
  }

  componentDidUpdate() {
    if (this.state.blockNavigation) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  sortChaptersByDateModified = (aDate, bDate) => {
    if (aDate && bDate) {
      return aDate < bDate
        ? 1
        : aDate > bDate
          ? -1
          : 0;
    } else if (aDate || bDate) {
      return aDate ? 1 : -1;
    } else {
      return 0;
    }
  }

  organizeGetChaptersResponse = (resJson) => {
    const { chapter_order, chapters } = resJson;

    let resultChapters = {};
    chapters.forEach(chapter => {
      resultChapters[chapter.id] = chapter;
    });

    const wipChapterIds = chapters.filter(chapter => {
      return chapter_order.indexOf(chapter.id) === -1;
    })
      .map(chapter => chapter.id)
      .sort((a,b) => {
        const aDate = resultChapters[a].date_modified;
        const bDate = resultChapters[b].date_modified;
        return this.sortChaptersByDateModified(aDate, bDate);
      });

    let resultColumns = {
      publishedChapters: {
        id: 'publishedChapters',
        title: 'Published Chapters',
        chapterIds: chapter_order,
      },
      wipChapters: {
        id: 'wipChapters',
        title: 'Work-In-Progress Chapters',
        chapterIds: wipChapterIds,
      },
    };

    return { chapters: resultChapters, 
      columns: resultColumns, 
      wipChapterIds, 
      pubChapterIds: chapter_order
    };
  }

  getChapters = () => {
    const bookId = this.props.match.params.bookId;
    EditorBookApiService.getChaptersByBookId(bookId)
      .then(resJson => {
        const { chapters, columns, pubChapterIds} = this.organizeGetChaptersResponse(resJson);
        const { title, id } = resJson;
        //save backups of the indexes so on drag/drop can check for changes made
        orderBackup = pubChapterIds;
        this.setState({ book: { title, id }});
        //update the context
        this.context.setChapters(chapters, columns);
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  showNewChapterForm = () => {
    this.setState({ newChapterForm: true });
  }

  hideNewChapterForm = () => {
    this.setState({ newChapterForm: false });
  }

  //#====================================================#
  //       functions for handling changes check
  //#====================================================#

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
    //if its the same source as destination, we just need to update the ids in each columns 'chapterIds' array
    if (source.droppableId === destination.droppableId) {
      //get the update 'chapterIds' array
      const newChapterIds = Array.from(sourceColumn.chapterIds);
      newChapterIds.splice(source.index, 1);
      newChapterIds.splice(destination.index, 0, draggableId);
      //update the column in context and validate changes made to the changes obj
      this.updateChangesObjOnColumnIndexes(
        source.droppableId,
        newChapterIds,
      )
      this.context.updateColumnChapterIds(
        source.droppableId,
        newChapterIds,
        this.checkIfChangedColumnIndexes
      );
    } else {
      //get the updated column 'chapterIds' arrays
      const sourceChapterIds = Array.from(sourceColumn.chapterIds);
      sourceChapterIds.splice(source.index, 1);
      const destinationChapterIds = Array.from(destinationColumn.chapterIds);
      destinationChapterIds.splice(destination.index, 0, draggableId);
      //update the columns in context and validate changes made to the changes obj
      this.updateChangesObjOnColumnsIndexes(
        source.droppableId,
        [sourceChapterIds,
        destinationChapterIds]
      );
      this.context.updateColumnsChapterIds(
        source.droppableId, 
        destination.droppableId, 
        sourceChapterIds,
        destinationChapterIds,
        this.checkIfChangedColumnsIndexes
      );
    }
  }

  onDiscardClick = (e) => {
    e.preventDefault();
    //check if there are no changes to be made
    if (!this.state.blockNavigation) {
      console.error('no changes');
      return;
    }
    //check if it's already doing a fetch request to prevent overlap
    if (this.state.fetching) {
      console.error('already fetching');
      return;
    }
    this.resetChanges();
    this.getChapters();
  }

  onSaveClick = (e) => {
    e.preventDefault();
    //check if there are no changes to be made
    if (!this.context.blockNavigation) {
      console.error('no changes');
      return;
    }
    //check if it's already doing a fetch request to prevent double-dipping
    if (this.state.fetching) {
      console.error('already fetching');
      return;
    }
    const deleteRequests = changes.deletions.map(id => {
      return EditorChaptersApiService.deleteChapter(id);
    });

    const createRequests = changes.creations.map(id => {
      const newChapter = {...this.context.chapters[id]};
      delete newChapter.id;
      return EditorChaptersApiService.createNewChapter(newChapter)
        .then(chapter => {
          this.context.updateChapter()
        })
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
    const patchRequests = Object.keys(patchObjects).map(id => {
      console.log(id, patchObjects[id]);
      return EditorChaptersApiService.updateChapter(id, patchObjects[id]);
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
              this.resetChanges();
              this.getChapters();
            });
        });
    });
  }

  
  checkIfChanged = () => {
    let blockNavigation = false;
    for (const [_, value] of Object.entries(changes)) {
      if (value.length > 0) {
        blockNavigation = true;
        break;
      }
    }
    this.setState({ blockNavigation }, () => console.log(this.state.blockNavigation, changes));
  }

  resetChanges = () => {
    changes = {
      deletions: [],
      creations: [],
      positions: [],
    };
    this.checkIfChanged();
  }

  updateChangesObjOnDelete = (chapterId, columnId) => {
    //check if the chapter is in the creations array
    const creationsIndex = changes.creations.indexOf(chapterId);
    if (creationsIndex !== -1) {
      changes.creations.splice(creationsIndex, 1);
    } else {
      changes.deletions.push(chapterId);
    }
    //check if the chapter is in the positions array, remove if so
    changes.positions[chapterId] && delete changes.positions[chapterId];
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

  updateChangesObjOnCreate = (newChapterId) => {
    changes.creations.push(newChapterId);
    //when creating, will always return true, this skips iteration
    this.setState({ blockNavigation: true }, () => console.log(this.state.blockNavigation, changes));
  }

  updateChangesObjOnColumnIndexes = (columnId, newChapterIds) => {
    //we only have to update indexes for the published chapters
    if (columnId === 'wipChapters') {
      return;
    }
    newChapterIds.forEach((id,i) => {
      //if the new ID does not equal the backed up index
      if (helpers.compareArrays(newChapterIds, orderBackup)) {
        changes.positions = [];
      } else {
        changes.positions = newChapterIds;
      }
    });
    this.checkIfChanged();
  }

  updateChangesObjOnColumnsIndexes = (sourceId, chapterIds) => {
    let publishedChapters;
    if (sourceId === 'wipChapters') {
      publishedChapters = chapterIds[1];
    } else {
      publishedChapters = chapterIds[0];
    }

    if (helpers.compareArrays(publishedChapters, orderBackup)) {
      changes.positions = [];
    } else {
      changes.positions = publishedChapters;
    }
    this.checkIfChanged();
  }

  handleCreateChapter = (e) => {
    e.preventDefault();
    const { title } = e.target;
    this.updateChangesObjOnCreate();
    this.context.createChapter(title.value);
    this.hideNewChapterForm();
  }

  handleDeleteChapter = (chapterId) => {
    this.updateChangesObjOnDelete(chapterId);
    this.context.deleteChapter(chapterId);
  }

  //#====================================================#
  //       render and related functions
  //#====================================================#

  getColumns = () => {
    return Object.keys(this.context.columns).map(key => {
      const column = this.context.columns[key];
      return <Column key={column.id} column={column} handleDeleteChapter={this.handleDeleteChapter}/>;
    });
  }

  render() {
    return (
      <>
        {this.state.book.title && <h1>{this.state.book.title}</h1>}
        <Prompt
          when={this.state.blockNavigation}
          message='You have unsaved changes'
        />
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.getColumns()}
        </DragDropContext>
        {this.state.newChapterForm && <NewChapterForm handleCreateNewChapter={this.handleCreateChapter}/>}
        <button onClick={this.showEditChapterForm}>Create new chapter</button>
        <button onClick={this.showNewChapterForm}>Create new chapter</button>
        {this.state.blockNavigation && <button onClick={this.onSaveClick}>Save Changes</button>}
        {this.state.blockNavigation && <button onClick={this.onDiscardClick}>Discard Changes</button>}
      </>
    );
    
  }
}

export default ChaptersEditorPage