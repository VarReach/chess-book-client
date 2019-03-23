import React, { Component } from 'react'
import uuid from 'uuid/v4'

const ChaptersEditorContext = React.createContext({
  chapters: {},
  columns: {},
  error: null,
  setChapters: () => {},
  updateColumnChapterIds: () => {},
  updateColumnsChapterIds: () => {},
  changeChapterTitle: () => {},
  deleteChapter: () => {},
  createChapter: () => {},
  setError: () => {},
});

export default ChaptersEditorContext;

export class ChaptersEditorProvider extends Component {
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
      deleteChapter: this.deleteChapter,
      createChapter: this.createChapter,
      setError: this.setError,
    };
  }

  setChapters = (chapters, fn) => {
    let resultChapters = {};
    let resultColumns = {
      publishedChapters: {
        id: 'publishedChapters',
        title: 'Published Chapters',
        chapterIds: [],
      },
      wipChapters: {
        id: 'wipChapters',
        title: 'Work-In-Progress Chapters',
        chapterIds: [],
      },
    };
    chapters.forEach(chapter => {
      resultChapters[chapter.id] = chapter;
      (chapter.published)
        ? resultColumns.publishedChapters.chapterIds.push(chapter.id)
        : resultColumns.wipChapters.chapterIds.push(chapter.id);
    });
    this.setState({
      chapters: resultChapters,
      columns: resultColumns,
    }, fn && fn());
  }

  //updates a single column
  updateColumnChapterIds = (columnId, newChapterIds, fn) => {
    this.setState({
      ...this.state,
      columns: {
        ...this.state.columns,
        [columnId]: {
          ...this.state.columns[columnId],
          chapterIds: newChapterIds,
        }
      }
    }, fn(columnId, newChapterIds));
  }

  //updates when moving between columns
  updateColumnsChapterIds = (sId, dId, sChapterIds, dChapterIds, fn) => {
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
    }, fn([sId, dId], [sChapterIds, dChapterIds]));
  }
  

  setError = (error) => {
    this.setState({ error });
  }

  changeChapterTitle = (chapterId, newTitle, fn) => {
    let newChapters = {...this.state.chapters};
    newChapters[chapterId] = {...newChapters[chapterId], title: newTitle};
    return this.setState({
      chapters: newChapters
    }, fn());
  }

  insertChapter = (newChapter, fn) => {
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
    }, fn(newChapter.id));
  }

  createChapter = (title, fn) => {
    //chapters have a temporary id until they're committed
    const tempId = uuid();
    const newChapter = {
      id: tempId,
      title,
      index: Object.keys(this.state.chapters).length+1,
      article_order: null,
      published: false,
      date_created: new Date(),
      date_published: null,
      date_modified: null
    };
    this.insertChapter(newChapter, fn);
  }

  deleteChapter = (chapterId, fn) => {
    let columnId;
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
    this.setState({ columns: newColumns }, fn());
  }

  render() {
    return (
      <ChaptersEditorContext.Provider value={this.state}>
        {this.props.children}
      </ChaptersEditorContext.Provider>
    )
  }
}
