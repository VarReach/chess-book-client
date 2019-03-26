import React, { Component } from 'react'
import ChaptersContext from '../../contexts/ChaptersContext';
import BooksApiService from '../../services/books-api-service';
import contentHelpers from '../../helpers/content-interpretor';

export default class ChapterPage extends Component {
  static contextType = ChaptersContext;

  componentDidMount() {
    //if all books aren't loaded yet, load the books
    const {bookId} = this.props.match.params;
    if (!Object.keys(this.context.books).length > 0) {
      BooksApiService.getAllBooks()
      .then(books => {
        let booksObj = {};
        books.forEach(book => {
          booksObj[book.id] = book;
        });
        this.context.setInitialBook(bookId, booksObj);
      }); 
    } else if (this.context.bookId !== this.props.match.params.bookId) {
      this.context.setBookId(bookId);
    }
  }

  testRenderContent = () => {
    const testData = ({
      "blocks": [
        {
          "key": "a983p",
          "text": "Hey there!",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "eoff2",
          "text": "",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "clh2f",
          "text": "",
          "type": "atomic",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {
            "type": "chessboard",
            "position": "start"
          }
        },
        {
          "key": "dh25o",
          "text": "Getting everything I can in here.",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [
            {
              "offset": 8,
              "length": 10,
              "style": "BOLD"
            },
            {
              "offset": 25,
              "length": 2,
              "style": "ITALIC"
            }
          ],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "1ddpg",
          "text": "It's a link!",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [
            {
              "offset": 7,
              "length": 4,
              "key": 0
            }
          ],
          "data": {}
        },
        {
          "key": "d0eo",
          "text": "a list!",
          "type": "unordered-list-item",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "sfvl",
          "text": "with more than one element!",
          "type": "unordered-list-item",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "dfgvv",
          "text": "an empty numbered list?",
          "type": "ordered-list-item",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "clqpg",
          "text": "",
          "type": "ordered-list-item",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "7nvma",
          "text": "a header?",
          "type": "header-two",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "16nkt",
          "text": "a quote",
          "type": "blockquote",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        },
        {
          "key": "fb6of",
          "text": "",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        }
      ],
      "entityMap": {
        "0": {
          "type": "LINK",
          "mutability": "MUTABLE",
          "data": {
            "url": "http://www.google.com"
          }
        }
      }
    });
    contentHelpers.parseChapterData(testData);
  }

  render() {
    const { chapterIndex } = this.props.match.params;
    const chapter = this.context.chapters[chapterIndex-1];
    return (
      <>
        {chapter && (
          <div>{chapter.title}
          {this.testRenderContent()}
          </div>
          
        )}
      </>
      
    )
  }
}
