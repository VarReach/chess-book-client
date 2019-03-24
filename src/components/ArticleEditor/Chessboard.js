import React, { Component } from 'react';
import ChessBoard from 'chessboardjsx';
import insertDataBlock from 'megadraft/lib/insertDataBlock';

class Chessboard extends Component {
  render() {
    return <ChessBoard position={this.props.data.position} draggable={false}/>
  }
}

class ChessButton extends Component {
  onClick = (e) => {
    e.preventDefault();
    const FENstring = window.prompt('Enter a FEN string');
    const data = {"type": "chessboard", "position": FENstring};
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