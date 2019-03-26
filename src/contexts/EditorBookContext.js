import React, { Component } from 'react'

const EditorBookContext = React.createContext({
  chapters: {},
  columns: {},
  error: null,
  setChapters: () => {},
  clearChapters: () => {},
  updateColumnChapterIds: () => {},
  updateColumnsChapterIds: () => {},
  changeChapterTitle: () => {},
  createChapter: () => {},
  updateCreatedChapterIds: () => {},
  deleteChapter: () => {},
  setError: () => {},
});

export default EditorBookContext;

export class EditorBookProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: {},
      columns: {},
      error: null,
      setChapters: this.setChapters,
      clearChapters: this.clearChapters,
      updateColumnChapterIds: this.updateColumnChapterIds,
      updateColumnsChapterIds: this.updateColumnsChapterIds,
      changeChapterTitle: this.changeChapterTitle,
      createChapter: this.createChapter,
      updateCreatedChapterIds: this.updateCreatedChapterIds,
      deleteChapter: this.deleteChapter,
      setError: this.setError,
    };
  }
  
  setChapters = (chapters, columns) => {
    this.setState({ chapters, columns });
  }

  clearChapters = () => {
    this.setState({ chapters: {}, columns: {} });
  }

  //updates a single column
  updateColumnChapterIds = (columnId, newChapterIds) => {
    this.setState({
      ...this.state,
      columns: {
        ...this.state.columns,
        [columnId]: {
          ...this.state.columns[columnId],
          chapterIds: newChapterIds,
        }
      }
    });
  }

  //updates when moving between columns
  updateColumnsChapterIds = (sId, dId, sChapterIds, dChapterIds) => {
    this.setState({
      ...this.state,
      columns: {
        ...this.state.columns,
        [sId]: {
          ...this.state.columns[sId],
          chapterIds: sChapterIds,
        },
        [dId]: {
          ...this.state.columns[dId],
          chapterIds: dChapterIds,
        },
      }
    });
  }

  changeChapterTitle = (chapterId, newTitle) => {
    let newChapters = {...this.state.chapters};
    newChapters[chapterId] = {...newChapters[chapterId], title: newTitle};
    return this.setState({
      chapters: newChapters
    });
  }

  updateCreatedChapterIds = (id, actualId) => {
    const chapter = {...this.state.chapters[id], id: actualId};
    //update the chapters object
    const newChapters = {...this.state.chapters};
    delete newChapters[id];
    newChapters[actualId] = chapter;
    //udpate the column 'chapterIds' arrays
    let newColumns = {...this.state.columns};
    for (const [key,value] of Object.entries(newColumns)) {
      const index = value.chapterIds.indexOf(id);
      if (index !== -1) {
        newColumns[key].chapterIds.splice(index, 1);
        newColumns[key].chapterIds.splice(index, 0, actualId);
        break;
      }
    }
    this.setState({ chapters: newChapters, columns: newColumns });
  }

  insertChapter = (newChapter) => {
    let newColumns = {
      ...this.state.columns,
      wipChapters: {
        ...this.state.columns.wipChapters,
        chapterIds: [...this.state.columns.wipChapters.chapterIds, newChapter.id]
      }
    }
    let newChapters = {...this.state.chapters}
    newChapters[newChapter.id] = newChapter;
    this.setState({
      chapters: newChapters,
      columns: newColumns,
    });
  }

  createChapter = (title, bookId, tempId) => {
    //chapters have a temporary id until they're committed
    const newChapter = {
      id: tempId,
      book_id: bookId,
      title,
      content: null,
      date_created: null,
      date_published: null,
      date_modified: null
    };
    this.insertChapter(newChapter);
  }

  deleteChapter = (chapterId, columnId) => {
    //delete the chapter from the chapters object
    const newChapters = {
      ...this.state.chapters,
    };
    delete newChapters[chapterId];
    //delete the chapter from the column 'chapterIds' array;
    const newChapterIds = Array.from(this.state.columns[columnId].chapterIds);
    const index = newChapterIds.indexOf(chapterId);
    newChapterIds.splice(index, 1);
    let newColumns = {
      ...this.state.columns,
      [columnId]: {
        ...this.state.columns[columnId],
        chapterIds: newChapterIds,
      }
    }
    //update the state and then the changes object
    this.setState({ columns: newColumns });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <EditorBookContext.Provider value={this.state}>
        {this.props.children}
      </EditorBookContext.Provider>
    )
  }
}
