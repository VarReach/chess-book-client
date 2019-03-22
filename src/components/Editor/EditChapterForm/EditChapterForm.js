import React, { Component } from 'react';
import ChaptersEditorContext from '../../../contexts/ChaptersEditorContext';

export default class NewChapterForm extends Component {
  state = {
    title: this.props.title,
  }

  static contextType = ChaptersEditorContext;

  handleOnChange = (e) => {
    this.setState({ title: e.target.value });
  }

  render() {
    return (
      <div className="editor__pop-up-bg-fader">
        <form className="editor__new-chapter-form" onSubmit={this.props.handleEditChapter}>
          <input required name="title" id="EditChapterForm__title" value={this.state.title} onChange={this.handleOnChange}></input>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}