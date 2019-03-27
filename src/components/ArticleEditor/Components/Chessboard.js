import React, { Component } from 'react';
import ChessBoard from 'chessboardjsx';

export default class Chessboard extends Component {
  render() {
    return (
      <figure className="article__plugin">
        <div className="article__chessboard-holder">
          <ChessBoard 
            position={this.props.data.position} 
            draggable={false} 
            darkSquareStyle={{ 'backgroundColor': '#7b605a'}}
            lightSquareStyle={{ 'backgroundColor': '#d9b69c'}}
            calcWidth={() => window.innerWidth < 500 ? 280 : 400}
          />
        </div>
        {this.props.data.caption && 
        <span className="article__caption">
          {this.props.data.caption}
          {this.props.data.source && <span className="article__source"> Source: {this.props.data.source}</span>}
        </span>}
      </figure>
    )
  }
}