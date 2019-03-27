import React, { Component } from 'react'
import BooksContext from '../../contexts/BooksContext';
import BooksApiService from '../../services/books-api-service';
import { convertToHTML } from 'draft-convert';
import { editorStateFromRaw } from 'megadraft';
import { Redirect } from 'react-router-dom';
import parse from 'html-react-parser';
import Chessboard from '../../components/ArticleEditor/Components/Chessboard';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './ChapterPage.css';

const testData = ({
  "blocks": [
    {
      "key": "a983p",
      "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac mauris fringilla felis viverra suscipit ac sit amet nibh. Donec euismod nibh in ante malesuada, sit amet aliquet magna porttitor. Aenean laoreet sit amet ipsum a lacinia. Curabitur ullamcorper sed ante et fermentum. Praesent est mauris, faucibus in volutpat at, suscipit vitae magna. Nam tempus urna in lorem venenatis consectetur et at lorem. Ut mi ex, malesuada non mi et, iaculis tristique ipsum. Sed placerat porttitor condimentum. Curabitur interdum metus quis pulvinar auctor. Nulla id posuere ante.",
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
        "position": "start",
        "caption": "This is what a standard chessboard looks like with the pieces set up correctly.",
        "source": "V. Topalov vs. K. Sasikiran."
      }
    },
    {
      "key": "dh25o",
      "text": "Nullam hendrerit tortor diam, sed eleifend ligula fringilla a. Nulla ante lectus, sollicitudin pretium nibh id, interdum suscipit velit. Proin nec interdum nibh. Vivamus eu ante euismod erat ornare gravida. Vivamus a tellus nec leo commodo faucibus et nec ligula. Curabitur dolor dui, accumsan a vehicula ac, aliquam quis massa. Fusce posuere tincidunt dictum. Phasellus sem nisl, congue ut est id, euismod feugiat neque. Pellentesque a porttitor tortor. Maecenas fringilla porta sollicitudin. Maecenas semper sodales ante, at condimentum leo vulputate ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam eget mollis eros.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 7,
          "length": 9,
          "style": "BOLD"
        }
      ],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "1ddpg",
      "text": "Nam et massa in est dictum accumsan et non dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar mollis massa id cursus. Nunc eget est a urna malesuada accumsan. Ut pellentesque in erat a ultrices. Nulla sem lacus, bibendum sit amet enim vitae, ultrices placerat felis. Pellentesque scelerisque facilisis imperdiet. Sed aliquam nibh et sodales varius. Quisque volutpat nisi libero, eu vulputate ligula lobortis eget. Sed congue odio non lectus dignissim congue. Curabitur mauris justo, ullamcorper in pellentesque ac, blandit ac nisi.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 7,
          "length": 5,
          "style": "ITALIC"
        }
      ],
      "entityRanges": [
        {
          "offset": 7,
          "length": 5,
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
      "text": "Suspendisse placerat egestas orci eu molestie. Etiam vulputate efficitur dui, in congue nisl convallis at. Ut ac ligula quis mauris auctor gravida.",
      "type": "blockquote",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "fb6of",
      "text": "Vestibulum vel dolor a lectus ultrices fringilla vel id mauris. Donec porttitor et ex ut imperdiet. Pellentesque vitae imperdiet enim. Suspendisse in sagittis leo. Nam porttitor, est at malesuada sagittis, sapien mauris pellentesque risus, tincidunt venenatis odio lacus in ex. Proin eget tortor tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur porttitor facilisis leo id aliquam. Sed at nisl pellentesque, egestas nunc sit amet, posuere velit. Donec eget mattis dui. Mauris consectetur velit vel aliquam euismod.",
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

export default class ChapterPage extends Component {
  static contextType = BooksContext;

  componentDidMount() {
    //if all books aren't loaded yet, load the books
    const {bookId} = this.props.match.params;
    if (!Object.keys(this.context.books).length > 0) {
      BooksApiService.getAllBooks()
      .then(books => {
        let defaultBook;
        let booksObj = {};
        books.forEach(book => {
          booksObj[book.id] = book;
          book.default_book && (defaultBook = book.id);
        });
        books[bookId] && (defaultBook = bookId);
        this.context.setInitialBook(defaultBook, booksObj);
      });
    } else if (this.context.bookId !== this.props.match.params.bookId) {
      this.context.setBookId(bookId);
    }
  }

  checkIfChessboard = (block) => {
    if (block.type === "atomic") {
      if (block.data.type === "chessboard") {
        return <div data-type={block.data.type} data-position={block.data.position}/>
      }
    }
  }

  interpBlockData = (block) => {
    if (block.type === "atomic" && block.data.type ==="chessboard") { 
      return <figure data-type="chessboard" data-position={block.data.position} data-caption={block.data.caption} data-source={block.data.source}/> 
    }
  }

  renderHTML = () => {
    const interp = {
      blockToHTML: (block) => this.interpBlockData(block),   
      entityToHTML: (entity, originalText) => {
        if (entity.type === 'LINK') {
          return <a className="article__link" href={entity.data.url}>{originalText}</a>;
        }
        return originalText;
      }
    };
    const html = convertToHTML(interp)(editorStateFromRaw(testData).getCurrentContent());
    const parseInterp = { 
      replace: (domNode) => {
        const { attribs } = domNode;
        if (!attribs) return;
        if (attribs['data-type'] === "chessboard") {
          return (
            <Chessboard data={{ position: attribs['data-position'], caption: attribs['data-caption'], source: attribs['data-source'] }}/>
          )
        }
      }
    }
    return parse(
      html,
      parseInterp
    );
  }

  render() {
    let { chapterIndex, bookId } = this.props.match.params;
    chapterIndex = parseInt(chapterIndex);
    const chapter = this.context.chapters[chapterIndex-1];
    const bookKeys = Object.keys(this.context.books);
    //checks to make sure the book / chapter combos are valid vs context
    const validBook = !((this.context.chapters.length > 0 && !chapter) //chapters exist and this specific chapter exists
                      || (bookKeys.length > 0 && bookKeys.indexOf(bookId) === -1) //this book exists
                      || (bookId !== this.context.bookId));
    return (
      <>
        {(this.context.chapters.length > 0 && chapter) && (
          <article className="article-container">
            <header className="article__header">
              <span>{this.context.books[this.context.bookId].title} | Chapter {chapterIndex}</span>
              <h1>{chapter.title}</h1>
            </header>
          {this.renderHTML()}
          <div className="article__chapter-buttons-holder">
            <button onClick={this.goToFirstChapter} disabled={chapterIndex === 1}><i className="fas fa-angle-double-left"/></button>
            <button onClick={this.goToPrevChapter} disabled={chapterIndex === 1}><i className="fas fa-angle-left"/></button>
            <button onClick={this.goToNextChapter} disabled={parseInt(chapterIndex) === this.context.chapters.length}><i className="fas fa-angle-right"/></button>
            <button onClick={this.goToLastChapter} disabled={chapterIndex === this.context.chapters.length}><i className="fas fa-angle-double-right"/></button>
          </div>
          </article>
        )};
      </>
      
    )
  }
}
