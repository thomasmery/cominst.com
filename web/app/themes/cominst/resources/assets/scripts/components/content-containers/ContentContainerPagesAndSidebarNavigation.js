import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import scrollToComponent from 'react-scroll-to-component';

class ContentContainerPagesAndSidebarNavigation extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeChildIndex: this.props.data.children.length ? 0 : null,
      activeChildContent: this.props.data.children.length ? this.props.data.children[0].introduction : '',
      childContentExpanded: false,
      activeChildContentStyles: {
        height: 'auto',
      },
      leftSidebarStyles: {
        position: 'sticky',
        top: 0,
      },
    }

    this._childContentContainerRef = null;

    this._childTitleClickHandler = this._childTitleClickHandler.bind(this);
    this._onContentToggleHandler = this._onContentToggleHandler.bind(this);

  }

  _setActiveChild (index) {
    this.setState( () => ( {
        activeChildIndex: index,
        activeChildContent: this.props.data.children[index].introduction,
        childContentExpanded: false,
      } ),
      () => {
          this.setState( () => ( {
            activeChildContentStyles: {
              height: this._childContentContainerRef.children[0].clientHeight,
            },
          } )
        );
      }
    )

    scrollToComponent(
      this._childContentContainerRef,
      {
        offset: - this.props.siteHeaderHeight - 20,
        align: 'top',
        duration: 300,
      }
    );
  }

  _toggleChildContent () {
    this.setState( (state) => ( {
          activeChildContent: ! state.childContentExpanded ?
            this.props.data.children[state.activeChildIndex].body :
            this.props.data.children[state.activeChildIndex].introduction,
          childContentExpanded: ! state.childContentExpanded,
      } ),
      () => {
        this.setState( (state) => ( {
          activeChildContentStyles: {
            height: state.childContentExpanded ?
              this._childContentContainerRef.scrollHeight :
              this._childContentContainerRef.children[0].clientHeight,
          },
        } )
      );
      }
    )

    scrollToComponent(
      this._childContentContainerRef,
      {
        offset: - this.props.siteHeaderHeight - 20,
        align: 'top',
        duration: 300,
      }
    );

  }

  _childTitleClickHandler (index, event) {
    event.preventDefault();
    this._setActiveChild(index);
  }

  _onContentToggleHandler () {
    this._toggleChildContent();
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
        activeChildContentStyles: {
          height: this._childContentContainerRef && this._childContentContainerRef.clientHeight,
        },
      } )
    );
  }

  render () {
    const {
      data,
    } = this.props;
    return (
      <div className="content-container content-container-pages-and-sidebar-navigation">
        <div className="row">
          <div className="col-sm-12">
            {/* <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } /> */}
          </div>
          <div className="col-sm-4 sidebar">
            <div style={this.state.leftSidebarStyles}>
              <h2 dangerouslySetInnerHTML={ { __html: data.title.rendered } }></h2>
              <ul className="nav">
              {
                data.children.map(
                  (child, index) => (
                    <li key={ child.id } className={ classNames({ active: index === this.state.activeChildIndex }, 'item') }>
                      <a onClick={ this._childTitleClickHandler.bind(null, index) } dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                    </li>
                  )
                )
              }
              </ul>
            </div>
          </div>
          <div className="col-sm-8 pages">
            {
              data.children.length ?
                <div>
                  <div className="child-content-container" style={this.state.activeChildContentStyles} ref={ (element) => this._childContentContainerRef = element }>
                    <div>
                      <div className="header">
                        <h3 className="title" dangerouslySetInnerHTML={ { __html: data.children[this.state.activeChildIndex].title.rendered } } />
                        { data.children[this.state.activeChildIndex].subtitle
                          && <h4 className="subtitle" dangerouslySetInnerHTML={ { __html: data.children[this.state.activeChildIndex].subtitle } } /> }
                      </div>
                      <div className="content" dangerouslySetInnerHTML={ { __html: this.state.activeChildContent } } />
                      <div className="actions">
                        {
                          data.children[this.state.activeChildIndex].content_parts.length > 1 ?
                            <a onClick={this._onContentToggleHandler}>
                              {
                                <span className={ ! this.state.childContentExpanded && 'collapsed'}>
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
                  <div className="child-image image" dangerouslySetInnerHTML={ { __html: data.children[this.state.activeChildIndex].featured_media_html || data.featured_media_html } } />
                </div> :
                'NO CHILDREN PAGES'
            }
          </div>
        </div>
      </div>
    );
  }
}

ContentContainerPagesAndSidebarNavigation.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object,
  siteHeaderHeight: PropTypes.number,
}

ContentContainerPagesAndSidebarNavigation.defaultProps = {
  siteHeaderHeight: 0,
}

export default ContentContainerPagesAndSidebarNavigation;
