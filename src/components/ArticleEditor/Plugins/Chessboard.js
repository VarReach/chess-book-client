import React, { Component } from 'react';
import insertDataBlock from 'megadraft/lib/insertDataBlock';
import Chessboard from '../Components/Chessboard';

class ChessButton extends Component {
  onClick = (e) => {
    e.preventDefault();
    const FENstring = window.prompt('Enter a FEN string');
    const caption = window.prompt('Enter a caption');
    const data = {"type": "chessboard", "position": FENstring, caption};
    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }

  render() {
    return (
      <button onClick={this.onClick}>
        CB
      </button>
    )
  }
}

export default {
  title: 'chessboard',
  type: 'chessboard',
  buttonComponent: ChessButton,
  blockComponent: Chessboard
}