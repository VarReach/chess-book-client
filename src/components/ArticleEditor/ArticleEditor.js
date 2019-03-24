import React, { Component } from "react";
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import ChessboardPlugin from './Chessboard';

export default class ArticleEditor extends Component {
  constructor(props) {
    super(props);
    const editorState = editorStateFromRaw(props.content);
    this.state = {editorState};
  }

  onChange = (editorState) => {
    this.setState({editorState});
  }
  

  onSaveClick = () => {
    const {editorState} = this.state;
    const content = editorStateToJSON(editorState);
    console.log(content);
  }

  render() {
    //determines if the document is changed by comparing the original JSON string to a freshly generated one.
    return (
      <>
        <MegadraftEditor
          editorState={this.state.editorState}
          onChange={this.onChange}
          spellCheck="true"
          plugins={[ChessboardPlugin]}
        />
        <button onClick={this.onSaveClick}>Save Changes</button>
        <button onClick={this.onDiscardClick}>Discard Changes</button>
      </>
    )
  }
}
