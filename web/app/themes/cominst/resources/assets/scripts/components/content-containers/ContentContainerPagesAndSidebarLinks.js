import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';

import classNames from 'classnames';

import scrollToComponent from 'react-scroll-to-component';

class ContentContainerPagesAndSidebarLinks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      childContentExpanded: this.props.data.children.map( () => false ),
      childContent: this.props.data.children.map( (child) => child.introduction ),
      childrenStyles: this.props.data.children.map( () => ({ height: 'auto' }) ),
      leftSidebarStyles: {
        position: 'sticky',
        top: 0,
      },
    }

    this._childrenRefs = [];
    this.scrollOffset = 0;

    this._onContentToggleHandler = this._onContentToggleHandler.bind(this);

  }

  _toggleContent (index) {

    this.setState( (state) => ({
      childContentExpanded: state.childContentExpanded.map( (value, _index) => {
        return index !== _index ? value : ! value;
      }),
      // as we toggle we always show the whole content as content - we will replace by 'introduction' on collapse when needed - see below
      childContent: state.childContent.map( (content, _index) => {
        return index !== _index ?
        content : this.props.data.children[index].content.rendered;
      }),
    }),
    () => {
        const _expanded = this.state.childContentExpanded[index];
        const _scrollOffset = - this.props.siteHeaderHeight - 50; // 50 is the content-container paddingTop - should be dynamic
        const _element = this._childrenRefs[index];
        const _scrollToElement = () => {
          scrollToComponent(_element,{
            offset: _scrollOffset,
            align: 'top',
            duration: 400,
          });
        }

        // at the end of collapsing we need to restore the 'introduction' as the content
        const _setContent = () => {
          this.setState( (state) => ({
            childContent: state.childContent.map( (content, _index) => {
              return index !== _index ?
              content : _expanded ? this.props.data.children[index].content.rendered : this.props.data.children[index].introduction;
            }),
          }))
          _element.removeEventListener('transitionend', _setContent, true);
        }

        _element.addEventListener(
          'transitionend',
          _setContent,
          true
        );

        _scrollToElement();

        this.setState( (state) => ({
            childrenStyles:
              state.childrenStyles.map( (styles, _index) => {
                return index !== _index ?
                  styles :
                  {
                    ...styles,
                    height: ! state.childContentExpanded[index]
                      ? state.childrenStyles[index].originalHeight
                      : this._childrenRefs[index].scrollHeight,
                  }
                }
              ),
          })
        );
      }
    );


  }

  _onContentToggleHandler (index, event) {
    event.preventDefault();
    this._toggleContent(index);
  }

  /** Lifecycle */

  componentWillReceiveProps (nextProps) {
    if(this.props.siteHeaderHeight !== nextProps.siteHeaderHeight) {
      this.setState( (state) => (
        {
          leftSidebarStyles: {
            ...state.leftSidebarStyles,
            top: nextProps.siteHeaderHeight + 50,
          },
        } )
      );
    }
  }

  componentDidMount () {
    this.setState( (state) => ( {
        leftSidebarStyles: {
          ...state.leftSidebarStyles,
          top: this.props.siteHeaderHeight + 50,
        },
        childrenStyles:
          this.props.data.children.map(
            (child, index) => ({
              height: this._childrenRefs[index].clientHeight,
              originalHeight: this._childrenRefs[index].clientHeight,
            })
          ),
      } )
    );

    /* window.addEventListener('resize', _.debounce(
          () => {
            this.props.data.children.forEach(
              (child, index) => {
                this._childrenRefs[index].style.height = 'auto';
                // this._childrenRefs[index].style.height = this._childrenRefs[index].clientHeight + 'px';
              }
            );

            this.setState( () => ( {
                childrenStyles:
                  this.props.data.children.map(
                    (child, index) => ({
                      height: this._childrenRefs[index].clientHeight,
                      originalHeight: this._childrenRefs[index].clientHeight,
                    })
                  ),
              } ),
              () => this.forceUpdate()
            );

        },
        250
      )
    )*/
  }

  _renderSidebarLinks () {
    const {
      data,
    } = this.props;

    const links = data.acf.links || [];

    return links.length
      ? <ul className="links">
        { links.map( (link) => (
            <li className="item" key={link.label}>
              <span>{link.title}</span><br />
              <a
                href={ link.type === 'page' ? link.page_url : link.file_url }
                target="_blank"
                rel="noopener noreferrer"
              >
                {  link.label }
              </a>
            </li>
          )
        ) }
      </ul>
      : ''
  }

  _renderSidebarImages () {
    const {
      data,
    } = this.props;

    const images = data.acf.images || [];

    return images.length
      ? <ul className="images">
        { images.map( (image) => (
            <li className="item" key={image.image.ID}>
              {
                image.title
                  && <span className="title"><span>{image.title}</span><br /></span>
              }
              <img src={ image.image.sizes.medium } alt={ image.image.name } />
            </li>
          )
        ) }
      </ul>
      : ''
  }
  render () {
    const {
      data,
    } = this.props;

    return (
      <div className="content-container content-container-pages-and-sidebar-links">
        <div className="row">
          <div className="col-md-4">
            <div className="sidebar" style={this.state.leftSidebarStyles}>
              <h2 dangerouslySetInnerHTML={ { __html: data.title.rendered } }></h2>
              <div className="links">
                { this._renderSidebarLinks() }
              </div>
              <div className="images">
                { this._renderSidebarImages() }
              </div>
            </div>
          </div>
          <div className="col-md-8">
            { data.content.rendered
                && <div className="page-content" dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
            }

            {
              data.children.map(
                (child, index) => (
                  <div key={ child.id } >
                    <div
                      className="child-content-container"
                      style={ this.state.childrenStyles[index] }
                      ref={ (element) => this._childrenRefs[index] = element }
                    >
                      <div className="header">
                        <h3 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                      </div>
                      <div className="content">
                        <div dangerouslySetInnerHTML={ {__html: this.state.childContent[index] } } />
                      </div>
                      <div className={ classNames( { 'has-more-content': child.content_parts.length > 1 }, 'actions')}>
                        {
                          child.content_parts.length > 1 ?
                            <a onClick={this._onContentToggleHandler.bind(null, index)}>
                              {
                                <span className={ ! this.state.childContentExpanded[index] && 'collapsed'}>
                                  <svg className="expand-button" width="29px" height="29px" viewBox="0 0 29 29" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                      <defs></defs>
                                      <g id="expand-button-container" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
                                          <g transform="translate(1.000000, 1.000000)" stroke="#018EC0" strokeWidth="2">
                                              <path d="M0,13 L27,13"></path>
                                              <path d="M14,27 L14,0"></path>
                                          </g>
                                      </g>
                                  </svg>
                                </span>
                              }
                            </a> : ''
                        }
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </div>
          <div className="col mobile">
            { this._renderSidebarLinks() }
            { this._renderSidebarImages() }
          </div>
        </div>
      </div>
    );
  }
}

ContentContainerPagesAndSidebarLinks.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object,
  siteHeaderHeight: PropTypes.number,
}

ContentContainerPagesAndSidebarLinks.defaultProps = {
  siteHeaderHeight: 0,
}

export default ContentContainerPagesAndSidebarLinks;
