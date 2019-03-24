import React, { Component } from 'react'
import uuid from 'uuid/v4'

const EditorBookContext = React.createContext({
  chapters: {},
  columns: {},
  error: null,
  setChapters: () => {},
  updateColumnChapterIds: () => {},
  updateColumnsChapterIds: () => {},
  changeChapterTitle: () => {},
  createChapter: () => {},
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
      updateColumnChapterIds: this.updateColumnChapterIds,
      updateColumnsChapterIds: this.updateColumnsChapterIds,
      changeChapterTitle: this.changeChapterTitle,
      createChapter: this.createChapter,
      deleteChapter: this.deleteChapter,
      setError: this.setError,
    };
  }

  setChapters = (chapters, columns) => {
    this.setState({ chapters, columns });
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

  changeChapterTitle = (chapterId, newTitle) => {
    let newChapters = {...this.state.chapters};
    newChapters[chapterId] = {...newChapters[chapterId], title: newTitle};
    return this.setState({
      chapters: newChapters
    });
  }

  createChapter = (title, bookId) => {
    //chapters have a temporary id until they're committed
    const tempId = uuid();
    const newChapter = {
      id: tempId,
      book_id: bookId,
      title,
      content: null,
      date_created: new Date(),
      date_published: null,
      date_modified: null
    };
    this.insertChapter(newChapter);
  }

  deleteChapter = (chapterId) => {
    let columnId;
    //find what column it's in and save to columnId
    for (const [key,value] of Object.entries(this.state.columns)) {
      if (value.chapterIds.indexOf(chapterId) !== -1) {
        columnId = key;
        break;
      }
    }
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
