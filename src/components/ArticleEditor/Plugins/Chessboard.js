import React, { Component } from 'react';
import insertDataBlock from 'megadraft/lib/insertDataBlock';
import Chessboard from '../Components/Chessboard';
import PopupForm from '../../PopupForm/PopupForm';

class ChessButton extends Component {
  state = {
    addChessboardForm: null,
  }

  handleAddChessboard = (e) => {
    e.preventDefault();
    const {position, caption, source} = e.target;
    const data = {"type": "chessboard", "position": position.value, "caption": caption.value, "source": source.value};
    this.props.onChange(insertDataBlock(this.props.editorState, data));
    this.hideAddChessboardForm();
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({ addChessboardForm: true });
  }

  hideAddChessboardForm = () => {
    this.setState({ addChessboardForm: null });
  }

  render() {
    let editElements;
    if (this.state.addChessboardForm) {
      editElements = [
        {
          type: 'header',
          text: 'Add new chessboard'
        },
        {
          type: 'input',
          text: 'Enter a position, either via FEN string or by designating \'start\':',
          props: {
            name: 'position',
            placeholder: 'start',
            id: 'chessboard-position-input',
            required: true,
          },
        },
        {
          type: 'input',
          text: 'Enter a caption:',
          props: {
            name: 'caption',
            id: 'chessboard-caption-input'
          },
        },
        {
          type: 'input',
          text: 'Enter a source',
          props: {
            name: 'source',
            id: 'chessboard-source-input'
          },
        },
      ];
    }
    return (
      <>
        {this.state.addChessboardForm && <PopupForm handleOnSubmit={this.handleAddChessboard} handleCancel={this.hideAddChessboardForm} elements={editElements}/>}
        <button className="sidemenu__button chessboard-button" onClick={this.onClick}>
          <i className="sidemenu__button__icon fas fa-chess-board"></i>
        </button>
      </>
    )
  }
}

export default {
  title: 'chessboard',
  type: 'chessboard',
  buttonComponent: ChessButton,
  blockComponent: Chessboard,
  options: {
    displayOptions: [
      {"key": "center", "icon": null, "label": "CENTER"},
      {"key": "left", "icon": null, "label": "LEFT"}]
  }
}