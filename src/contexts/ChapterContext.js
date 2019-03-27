import React, { Component } from 'react'

const ChapterContext = React.createContext({
  chapter: {},
  lastChapterAvailable: null,
  error: null,
  setChapter: () => {},
  clearChapter: () => {},
  setError: () => {},
  getChapter: () => {},
});

export default ChapterContext;

export class ChapterProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapter: {},
      lastChapterAvailable: null,
      error: null,
      setChapter: this.setChapter,
      clearChapter: this.clearChapter,
      getChapter: this.getChapter,
      setError: this.setError
    };
  }

  getChapter = (bookId, chapterIndex) => {

  }

  setChapter = (chapter) => {
    let newState = { chapter, lastChapterAvailable: chapter.last_chapter_available };
    delete newState.chapter.last_chapter_available;
    this.setState(newState);
  }

  clearChapter = () => {
    this.setState({ chapter: {} });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <ChapterContext.Provider value={this.state}>
        {this.props.children}
      </ChapterContext.Provider>
    )
  }
}
