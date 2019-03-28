import React, { Component } from 'react'

const MockBooksContext = React.createContext({
  bookId: null,
  books: {},
});

export default MockBooksContext;

export class MockBooksProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: 1,
      books: {
        '1': {
          title: 'Testing',
          blurb: 'Testing',
          default_book: true,
          id: 1,
          chapter_order: null,
          chapters: null,
        }
      },
    };
  }

  render() {
    return (
      <MockBooksContext.Provider value={this.state}>
        {this.props.children}
      </MockBooksContext.Provider>
    )
  }
}
