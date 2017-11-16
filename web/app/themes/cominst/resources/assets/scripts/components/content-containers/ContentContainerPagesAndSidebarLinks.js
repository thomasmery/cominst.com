import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        const _scrollOffset = - this.props.siteHeaderHeight - 20;
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
                    height: ! state.childContentExpanded[index] ? state.childrenStyles[index].originalHeight : this._childrenRefs[index].scrollHeight,
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
            top: nextProps.siteHeaderHeight + 20,
          },
        } )
      );
    }
  }

  componentDidMount () {
    this.setState( (state) => ( {
        leftSidebarStyles: {
          ...state.leftSidebarStyles,
          top: this.props.siteHeaderHeight + 20,
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
  }

  render () {
    const {
      data,
    } = this.props;
    const links = data.acf.links || [];
    return (
      <div className="content-container content-container-pages-and-sidebar-links">
        <div className="row">
          <div className="col-sm-4">
            <div className="sidebar" style={this.state.leftSidebarStyles}>
              <h2 dangerouslySetInnerHTML={ { __html: data.title.rendered } }></h2>
              {
                links.length
                 ? <ul className="links">
                    { links.map( (link) => (
                        <li className="item" key={link.label}>
                          <span>{link.title}</span><br />
                          <a href={ link.type === 'page' ? link.page_url : link.file_url }>{  link.label }</a>
                        </li>
                      )
                    ) }
                  </ul>
                  : ''
                }
            </div>
          </div>

          <div className="col-sm-8">

            <div className="page-content" dangerouslySetInnerHTML={ { __html: data.content.rendered } } />

            {
              data.children.map(
                (child, index) => (
                  <div key={ child.id } >
                    <div className="child-content-container" style={ this.state.childrenStyles[index] } ref={ (element) => this._childrenRefs[index] = element }>
                      <div className="header">
                        <h3 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                      </div>
                      <div className="content">
                        <div dangerouslySetInnerHTML={ {__html: this.state.childContent[index] } } />
                      </div>
                      <div className="actions">
                        {
                          child.content_parts.length > 1 ?
                            <a onClick={this._onContentToggleHandler.bind(null, index)}>
                              {
                                <span className={ ! this.state.childContentExpanded[index] && 'collapsed'}>
                                  <svg className="expand-button" width="29px" height="29px" viewBox="0 0 29 29" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                      <defs></defs>
                                      <g id="expand-button-container" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
                                          <g id="expand-button-group" transform="translate(1.000000, 1.000000)" stroke="#018EC0" strokeWidth="2">
                                              <path d="M0,13 L27,13" id="horizontal-line"></path>
                                              <path d="M14,27 L14,0" id="vertical-line"></path>
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
