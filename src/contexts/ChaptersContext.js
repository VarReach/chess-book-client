import React, { Component } from 'react'
import ChaptersApiService from '../services/chapters-api-service';

const ChaptersContext = React.createContext({
  totalChapters: null,
  bookId: null,
  chapters: [],
  books: {},
  error: null,
  setBookId: () => {},
  setInitialBook: () => {},
  setError: () => {},
});

export default ChaptersContext;

export class ChaptersProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalChapters: null,
      bookId: null,
      chapters: [],
      books: {},
      error: null,
      setBookId: this.setBookId,
      setInitialBook: this.setInitialBook,
      setError: this.setError
    };
  }

  getChaptersByBookId = () => {
    //check if chapters and articles are already loaded
    ChaptersApiService.getChaptersByBookId(this.state.bookId)
      .then(chapters => {
        this.setState({ chapters });
      })
      .catch(error => {
        this.setState({ error });
      });
  }


  setBookId = (bookId) => {
    this.setState({ bookId }, this.getChaptersByBookId);
  }

  setInitialBook = (bookId, books) => {
    this.setState({ bookId, books }, this.getChaptersByBookId);
  }

  setChapters = (chapters) => {
    this.setState({ chapters });
  }

  setError = (error) => {
    this.setState({ error });
  }

  render() {
    return (
      <ChaptersContext.Provider value={this.state}>
        {this.props.children}
      </ChaptersContext.Provider>
    )
  }
}
