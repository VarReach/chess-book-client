import React from 'react';

export default function NewChapterForm(props) {
  return (
    <div className="editor__pop-up-bg-fader">
      <form className="editor__new-chapter-form" onSubmit={props.handleCreateNewChapter}>
        <input required name="title" id="NewChapterForm__title" placeholder="Chapter title"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}