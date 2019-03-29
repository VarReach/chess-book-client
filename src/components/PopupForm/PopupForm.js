import React, { Component } from 'react';
import './PopupForm.css'

export default class PopupForm extends Component {

  static defaultProps = {
    elements: [],
  }

  handleCheckboxToggle = ({target}) => {
    if (target.checked){
      target.removeAttribute('checked');
   } else {
      target.setAttribute('checked', true);
   }
  }

  renderChildren = () => {
    return this.props.elements.map((element, i) => {
      if (element.type === 'header') {
        return <h2 {...element.props} key={i}>{element.text}</h2>;
      } else if (element.type === 'checkbox') {
        return (
          <div className="form__input-holder" key={i}>
            <label htmlFor={element.id}>{element.text}</label>
            <input type="checkbox" {...element.props} onClick={this.handleCheckboxToggle}/>
          </div>);
      } else if (element.type === 'input') {
        return (
          <div className="form__input-holder" key={i}>
            <label htmlFor={element.id}>{element.text}</label>
            <input {...element.props}/>
          </div>);
      }
      return null;
    });
  }

  render() {
    return (
      <>
        <div className="document-blackout"/>
        <form className="popup-form form-holder" onSubmit={this.props.handleOnSubmit}>
          {this.renderChildren()}
          <div className="form-button-holder">
            <button type="submit" className="form__submit-button">
              <i className="fas fa-check"/>
            </button>
            <button type="button" className="form__cancel-button" onClick={this.props.handleCancel}>
              <i className="fas fa-ban"/>
            </button>
          </div>
        </form>
      </>
    );
  }
}