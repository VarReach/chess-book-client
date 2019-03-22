import React, { Component } from 'react'
import config from '../../config';
import ChaptersContext from '../../contexts/ChaptersContext';
import Chapter from '../../components/Chapter/Chapter';
import queryString from 'query-string';
import ChapterApiService from '../../services/chapter-api-service';

class ChaptersPage extends Component {
  static contextType = ChaptersContext;

  componentDidMount() {
    //check if chapters and articles are already loaded
    const query = queryString.parse(this.props.location.search);
    const { page, rpp } = query;
    ChapterApiService.getChapters(page, rpp)
      .then(resp => {
        this.context.setChapters(resp);
      })
      .catch(err => {
        this.context.setError(err);
      });
  }

  renderChapters = () => {
    return this.context.chapters.map((chapter) => {
      return <Chapter key={chapter.id} chapter={chapter}/>;
    });
  }

  render() {
    return (
      <section>
        {this.context.chapters && this.renderChapters()}
      </section>
    );
  }
}

export default ChaptersPage
