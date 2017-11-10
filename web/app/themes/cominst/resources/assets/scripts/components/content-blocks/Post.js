import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import scrollToComponent from 'react-scroll-to-component';

class Post extends Component {

  constructor (props) {
    super(props);

    this.scrollOffset = 0;

    this.state = {
      active: props.active || false,
      contentStyles: {
        transition: 'height 0.4s ease-out, opacity 0.4s ease-out',
        overflow: 'hidden',
      },
    }

    this._toggleButtonClickHandler = this._toggleButtonClickHandler.bind(this);
    this._contentContainerTransitionEndHandler = this._contentContainerTransitionEndHandler.bind(this);

  }

  componentWillReceiveProps (nextProps) {
    if(this.props.active !== nextProps.active &&
      nextProps.active) {
        this._toggleContent();
    }
  }

  componentDidMount () {
    const header = document.querySelector('#app header');
    const headerHeight = header.offsetHeight;
    this.scrollOffset = headerHeight + 20;
    this.originalContentHeight = this._contentBoxRef.clientHeight;
    this.setState( () => (
      {
        contentStyles: {
          ...this.state.contentStyles,
          height: this.originalContentHeight,
        },
      }
    ));
  }

  _toggleActive ( callback = () => {} ) {
    this.setState( (state) => (
        {
          ...state,
          active: ! state.active,
        }
      ),
      callback
    );
  }

  _contentContainerTransitionEndHandler () {
    console.log('ended');//eslint-disable-line
    this._toggleActive();
    this.props.history.push(this.props.postsListPath);
    this.setState((state) => ({
      contentStyles: {
        ...state.contentStyles,
        opacity: 1,
      },
    }));
    this._contentContainerRef.removeEventListener(
      'transitionend',
      this._contentContainerTransitionEndHandler,
      true
    );
  }

  _toggleContent() {

    if(this.state.active) {
      this.setState((state) => ({
        contentStyles: {
          ...state.contentStyles,
          height: this.originalContentHeight,
          opacity: 0.1,
        },
      }));
      this._contentContainerRef.addEventListener(
        'transitionend',
        this._contentContainerTransitionEndHandler,
        true
      )
    }
    else {
      this._toggleActive(
        () => (
          this.setState((state) => ({
            contentStyles: {
              ...state.contentStyles,
              height: this._contentBoxRef.scrollHeight,
            },
          }))
        )
      );
    }

    scrollToComponent(
      this,
      {
        offset: - this.scrollOffset,
        align: 'top',
        duration: 300,
      }
    );
  }

  _toggleButtonClickHandler (event) {
    event.preventDefault();
    this._toggleContent();
  }

  render () {
    const {
      data,
      data: { content: { rendered: content }},
      data: { excerpt: { rendered: excerpt }},

    } = this.props;
    const activeContent = this.state.active ? content : excerpt.replace(/<a.*?>.*?<\/a>/g, '');
    return (
      <div key={ data.id }>
        <div>
          {
            data.categories_names.map(
              (name, index) => (
                <span key={index} dangerouslySetInnerHTML={ {__html: name } } />
              )
            )
          }
          <span> - <span dangerouslySetInnerHTML={ {__html: data.formatted_published_date } } /> </span>
          {
             data.medias_names.length ?
              data.medias_names.map(
                (name, index) => (
                  <span key={index}> - <span dangerouslySetInnerHTML={ {__html: name } } /> </span>
                )
              ) : ''
          }
        </div>
        <h3 style={ { color: this.state.active ? 'green' : 'blue'} } dangerouslySetInnerHTML={ {__html: data.title.rendered } } />
        <div style={this.state.contentStyles} ref={ (element) => this._contentContainerRef = element }>
          <div ref={ (element) => this._contentBoxRef = element } dangerouslySetInnerHTML={ {__html: activeContent } } />
        </div>
        <div>
          {
            ! this.state.active ?
              <Link to={data.path}>+</Link> :
              <a href="#" onClick={this._toggleButtonClickHandler}>-</a>
          }
        </div>
      </div>
    )
  }
}

Post.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object,
  active: PropTypes.bool,
  postsListPath: PropTypes.string,
  history: PropTypes.object,
}

export default Post;
