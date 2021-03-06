import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import { Prompt } from 'react-router';
import EditorBookContext from '../../contexts/EditorBookContext';
import EditorBookApiService from '../../services/editor-book-api-service';
import EditorChaptersApiService from '../../services/editor-chapters-api-service';
import Column from '../../components/Editor/Column/Column';
import Loading from '../../components/Loading/Loading';
import helpers from '../../helpers/misc-helpers';
import PopupForm from '../../components/PopupForm/PopupForm';
import Error from '../../components/Error/Error';
import uuid from 'uuid/v4';
import { Link } from 'react-router-dom';
import './EditorBookPage.css'

//holds any changes made
let changes = {
  deletions: [],
  creations: [],
  newPositions: null, //incase the user moves all published chapters out
  positions: [],
  titles: {},
};
let orderBackup;
let titleBackup = {};

class ChaptersEditorPage extends Component {
  state = {
    book: {},
    columns: {},
    chapterOrder: [],
    loading: true,
    editChapterForm: null,
    blockNavigation: null,
  }

  static defaultProps = {
    match: {
      params: {}
    }
  }

  static contextType = EditorBookContext;

  componentDidMount() {
    this.getChapters();
  }

  componentWillUnmount() {
    this.context.clearChapters();
    window.onbeforeunload = undefined;
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
    let { chapter_order, chapters } = resJson;
    !chapters && (chapters = []);

    let resultChapters = {};
    chapters.forEach(chapter => {
      resultChapters[chapter.id] = chapter;
      titleBackup[chapter.id] = chapter.title;
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
        this.setState({ book: { title, id }, loading: null });
        //update the context
        this.context.setChapters(chapters, columns);
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  hideNewChapterForm = () => {
    this.setState({ newChapterForm: null });
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
        destinationChapterIds
      );
    }
  }

  onDiscardClick = (e) => {
    e.preventDefault();
    //check if there are no changes to be made
    if (!this.state.blockNavigation) {
      return;
    }
    //check if it's already doing a fetch request to prevent overlap
    if (this.state.loading) {
      return;
    }
    this.resetChanges();
    this.setState({ loading: true}, () => this.getChapters())
  }

  updateCreatedChapterIds = (id, actualId) => {
    const index = changes.positions.indexOf(id);
    if (index !== -1) {
      changes.positions.splice(index, 1);
      changes.positions.splice(index, 0, actualId);
    }
  }

  createCreateRequests = () => {
    return changes.creations.map(id => {
      const newChapter = {...this.context.chapters[id]};
      delete newChapter.id;
      return EditorChaptersApiService.createNewChapter(newChapter)
        .then(chapter => {
          //need to update the ids in changes.positions and context with the one we get back from the request
          const actualId = chapter.id;
          this.context.updateCreatedChapterIds(id, actualId);
          this.updateCreatedChapterIds(id, actualId);
        })
    });
  }

  createDeleteRequests = () => {
    return changes.deletions.map(id => {
      return EditorChaptersApiService.deleteChapter(id);
    });
  }

  createPatchRequests = () => {
    let patchRequests = [];

    if (changes.newPositions) {
      patchRequests.push(EditorBookApiService.updateBook(
        this.state.book.id, 
        { chapter_order: changes.positions }
      ));
    }

    Object.keys(changes.titles).forEach(id => {
      patchRequests.push(EditorChaptersApiService.updateChapter(
        id, {title: changes.titles[id]}
      ));
    });

    return patchRequests;
  }

  onSaveClick = (e) => {
    e.preventDefault();
    //check if there are no changes to be made
    if (!this.state.blockNavigation) {
      return;
    }
    //check if it's already doing a fetch request to prevent double-dipping
    if (this.state.loading) {
      return;
    }

    const deleteRequests = this.createDeleteRequests();
    const createRequests = this.createCreateRequests();

    this.setState({ loading: true }, () => {
      //handle all creation/deletion requests
      Promise.all([
        ...deleteRequests,
        ...createRequests
      ])
        .then(() => {
          const patchRequests = this.createPatchRequests();
          Promise.all(patchRequests)
            //get updated DOM, reset the changes object and state 
            .then(() => {
              this.resetChanges();
              this.getChapters();
            });
        })
        .catch(err => {
          this.context.setError(err);
        });
    });
  }

  checkIfChanged = () => {
    let blockNavigation = false;
    for (const key of Object.keys(changes)) {
      const value = changes[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          blockNavigation = true;
          break;
        }
      } else if (typeof(value) === 'boolean') {
        if (value) {
          blockNavigation = value;
          break;
        }
      } else if (value) {
        if (Object.keys(value).length > 0) {
          blockNavigation = true;
          break;
        }
      }
    }
    this.setState({ blockNavigation });
  }

  resetChanges = () => {
    changes = {
      deletions: [],
      creations: [],
      newPositions: null, //incase the user moves all published chapters out
      positions: [],
      titles: {},
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
    //get an updated order for the published column without the deleted chapter
    //compare against the backup -> not same ? update the changes.positions array : reset it
    //we only track positions for published chapters in the DB
    if (columnId === 'publishedChapters') {
      let chapterPositions = Array.from(this.context.columns['publishedChapters'].chapterIds)
      const positionsIndex = chapterPositions.indexOf(chapterId);
      positionsIndex !== -1 && chapterPositions.splice(positionsIndex, 1);
      if (!helpers.compareArrays(orderBackup, chapterPositions)) {
        changes.positions = chapterPositions;
        changes.newPositions = true;
      } else {
        changes.positions = [];
        changes.newPositions = false;
      }
    }
    this.checkIfChanged();
  }

  updateChangesObjOnCreate = (newChapterId) => {
    changes.creations.push(newChapterId);
    //when creating, will always return true, this skips iteration
    this.setState({ blockNavigation: true });
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
        changes.newPositions = false;
      } else {
        changes.positions = newChapterIds;
        changes.newPositions = true;
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
      changes.newPositions = false;
    } else {
      changes.positions = publishedChapters;
      changes.newPositions = true;
    }
    this.checkIfChanged();
  }

  updateChangesObjOnEditTitle = (chapterId, newTitle) => {
    if (newTitle === titleBackup[chapterId]) {
      changes.titles[chapterId] && delete changes.titles[chapterId];
    } else {
      if (changes.creations.indexOf(chapterId) === -1) {
        changes.titles[chapterId] = newTitle;
      }
    }
    this.checkIfChanged();
  }

  handleCreateChapter = (e) => {
    e.preventDefault();
    const title = prompt('Enter a name for the new chapter:')
    if (!title) {
      return;
    }
    const titleError = helpers.verifyChapterTitle(title);
    if (titleError) {
      this.context.setError(titleError);
      return;
    }
    const tempId = uuid();
    this.updateChangesObjOnCreate(tempId);
    this.context.createChapter(title, this.state.book.id, tempId);
    this.hideNewChapterForm();
  }

  handleDeleteChapter = (chapterId) => {
    const confirmation = window.confirm(`Are you sure you want to delete the chapter?`)
    if (confirmation) {
      let columnId;
      //find what column it's in and save to columnId
      for (const [key,value] of Object.entries(this.context.columns)) {
        if (value.chapterIds.indexOf(chapterId) !== -1) {
          columnId = key;
          break;
        }
      }
      this.updateChangesObjOnDelete(chapterId, columnId);
      this.context.deleteChapter(chapterId, columnId);
    }
  }

  handleEditChapter = (e) => {
    e.preventDefault();
    const { rename } = e.target;
    const chapterId = this.state.editChapterForm;
    const titleError = helpers.verifyChapterTitle(rename.value);
    if (titleError) {
      this.context.setError(titleError);
      return;
    }
    this.updateChangesObjOnEditTitle(chapterId, rename.value);
    this.context.changeChapterTitle(chapterId, rename.value);
    this.hideEditChapterForm();
  }

  //#====================================================#
  //       render and related functions
  //#====================================================#

  showEditChapterForm = (chapterId) => {
    this.setState({ editChapterForm: chapterId });
  }

  hideEditChapterForm = () => {
    this.setState({ editChapterForm: null });
  }

  getColumns = () => {
    return Object.keys(this.context.columns).map(key => {
      const column = this.context.columns[key];
      return <Column key={column.id} column={column} handleDeleteChapter={this.handleDeleteChapter} showEditChapterForm={this.showEditChapterForm}/>;
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading status={this.context.error} />
    }
    let editElements;
    if (this.state.editChapterForm) {
      const chapter = this.context.chapters[this.state.editChapterForm];
      editElements = [
        {
          type: 'header',
          text: 'Edit'
        },
        {
          type: 'input',
          text: 'Enter a new name',
          props: {
            name: 'rename',
            placeholder: chapter.title,
            id: 'editor-chapters-form__rename'
          },
        },
      ];
    }
    return (
      <div className="editor-book-page__container container">
        {this.context.error && <Error error={this.context.error.message} hideError={() => this.context.setError(null)} />}
        {this.state.book.title && <h1>{this.state.book.title}</h1>}
        <span><Link to="/editor">Editor</Link> | Chapter {this.props.match.params.bookId}</span>
        <Prompt
          when={this.state.blockNavigation}
          message='You have unsaved changes'
        />
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.getColumns()}
        </DragDropContext>
        {/* {this.state.newChapterForm && <NewChapterForm handleCreateNewChapter={this.handleCreateChapter}/>} */}
        {this.state.editChapterForm && <PopupForm handleOnSubmit={this.handleEditChapter} handleCancel={this.hideEditChapterForm} elements={editElements}/>}
        <div className="editor-book-page__button-holder">
          <button onClick={this.handleCreateChapter}><i className="fas fa-plus"/></button>
          {this.state.blockNavigation && <button onClick={this.onSaveClick}><i className="fas fa-save"/></button>}
          {this.state.blockNavigation && <button onClick={this.onDiscardClick}><i className="fas fa-ban"/></button>}
        </div>
      </div>
    );
    
  }
}

export default ChaptersEditorPage