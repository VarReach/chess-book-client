import React from 'react';
import ChessBoard from 'chessboardjsx';

const contentInterpreter = {
  checkContent(contentArr) {
    return contentArr.map((content, i) => {
      //non formattable-text / non-text checks
      const conversionTable = {
        '[section title]': this.convertTitles,
        '[chessboard]': this.convertBoards,
        '[image]': this.convertImages,
        '[video]': this.convertVideos,
      }
      for (let key in conversionTable) {
        //check for images, section titles, and chessboards
        if (content.startsWith(key)) {
          return conversionTable[key](content, i);
        }
      }

      //formattable-text
      //TODO: sweep text for [b][/b] [i][/i] [u][/u] tages for bold, italics, underline
      //TODO: sweep text for [link](http://...)[/link]
      //bold text \[b\][^\]]*\/b\]
      return <p key={i}>{content}</p>
    });
  },
  convertTitles(content, i) {
    return <h2 key={i}>{content.slice(15)}</h2>;
  },
  convertBoards(content, i) {
    return <ChessBoard key={i} position={content.slice(12)}/>;
  },
  convertImages(content, i) {
    const imageTextStrings = content.slice(7).split('::');
    const imageSRC = imageTextStrings[0];
    const imageALT = imageTextStrings[1];
    return <img key={i} src={imageSRC} alt={imageALT}/>
  },
  convertVideos(content, i) {
    const videoTextStrings = content.slice(7).split('::');
    const videoSRC = videoTextStrings[0];
    const videoTitle = videoTextStrings[1];
    return <iframe title={videoTitle} width="320" height="240" key={i} src={videoSRC}></iframe>
  }
};

export default contentInterpreter;