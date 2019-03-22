import React, { Component } from 'react'

const ChaptersContext = React.createContext({
  totalChapters: null,
  chapters: [],
  error: null,
  setChapters: () => {},
  setError: () => {},
})

export default ChaptersContext;

export class ChaptersProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalChapters: null,
      chapters: [],
      error: null,
      setChapters: this.setChapters,
      setError: this.setError
    };
  }

  setChapters = (resp) => {
    this.setState({ chapters: resp.chapters, totalChapters: resp.totalChapters });
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
