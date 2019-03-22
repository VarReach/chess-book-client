import React, { Component } from 'react'
import EditorApiService from '../services/editor-api-service';

const ChaptersEditorContext = React.createContext({
  chapters: {},
  columns: {},
  editing: null,
  error: null,
  setChapters: () => {},
  insertChapter: () => {},
  setError: () => {},
  showEditChapterForm: () => {},
  hideEditChapterForm: () => {},
  updateColumnChapterIds: () => {},
});

export default ChaptersEditorContext;

export class ChaptersEditorProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: {},
      columns: {},
      editing: null,
      error: null,
      setChapters: this.setChapters,
      insertChapter: this.insertChapter,
      updateChapter: this.updateChapter,
      showEditChapterForm: this.showEditChapterForm,
      hideEditChapterForm: this.hideEditChapterForm,
      updateColumnChapterIds: this.updateColumnChapterIds,
      setError: this.setError
    };
    this.backup = {
      chapters: {},
    }
  }

  setChapters = (chapters) => {
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
    });
    this.backup = resultChapters;
    console.log(this.backup);
  }

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

  insertChapter = (newChapter) => {
    let resultColumns = {
      ...this.state.columns,
      wipChapters: {
        ...this.state.columns.wipChapters,
        chapterIds: [...this.state.columns.wipChapters.chapterIds, newChapter.id]
      }
    }
    let resultChapters = {...this.state.chapters}
    resultChapters[newChapter.id] = newChapter;
    this.setState({
      chapters: resultChapters,
      columns: resultColumns,
    });
  }

  updateChapter = (chapterId, updatedChapter) => {
    let resultChapters = {...this.state.chapters};
    resultChapters[chapterId] = updatedChapter;
    this.setState({
      chapters: resultChapters
    });
  }

  showEditChapterForm = (chapterId) => {
    this.setState({ editing: chapterId });
  }

  hideEditChapterForm = () => {
    this.setState({ editing: null });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <ChaptersEditorContext.Provider value={this.state}>
        {this.props.children}
      </ChaptersEditorContext.Provider>
    )
  }
}
