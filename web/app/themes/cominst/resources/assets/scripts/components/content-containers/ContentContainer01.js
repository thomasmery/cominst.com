import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import scrollToComponent from 'react-scroll-to-component';

class ContentContainer01 extends Component {

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
    this.scrollOffset = 0;

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
        offset: - this.scrollOffset,
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
        offset: - this.scrollOffset,
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

  componentDidMount () {
    const header = document.querySelector('#app header');
    const headerHeight = header.offsetHeight;
    this.scrollOffset = headerHeight + 40;
    this.setState( (state) => ( {
        activeChildContentStyles: {
          height: this._childContentContainerRef.clientHeight,
        },
        leftSidebarStyles: {
          ...state.leftSidebarStyles,
          top: this.scrollOffset,
        },
      } )
    );
  }

  render () {
    const {
      data,
    } = this.props;
    return (
      <div className="content-container content-container-01">
        <div className="row">
          <div className="col-sm-12">
            {/* <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } /> */}
          </div>
          <div className="col-sm-4">
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
          <div className="col-sm-8">
            {
              data.children.length ?
                <div>
                  <div className="child-content-container" style={this.state.activeChildContentStyles} ref={ (element) => this._childContentContainerRef = element }>
                    <div>
                      <h3 className="child-title" dangerouslySetInnerHTML={ { __html: data.children[this.state.activeChildIndex].title.rendered } } />
                      <div className="child-content" dangerouslySetInnerHTML={ { __html: this.state.activeChildContent } } />
                      <div>
                        {
                          data.children[this.state.activeChildIndex].content_parts.length > 1 ?
                            <a onClick={this._onContentToggleHandler}>
                              { this.state.childContentExpanded ? 'Collapse' : 'Expand' }
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

ContentContainer01.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object,
}

export default ContentContainer01;
