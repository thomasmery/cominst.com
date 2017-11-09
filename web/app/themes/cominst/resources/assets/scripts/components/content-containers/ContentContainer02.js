import React, { Component } from 'react';
import PropTypes from 'prop-types';

import scrollToComponent from 'react-scroll-to-component';

class ContentContainer02 extends Component {

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
      childContent: state.childContent.map( (content, _index) => {
        return index !== _index ?
        content : this.props.data.children[index].body;
      }),
    }),
    () => {
        const _expanded = this.state.childContentExpanded[index];
        const _scrollOffset = - this.scrollOffset;
        const _element = this._childrenRefs[index];
        const _scrollToElement = () => {
          if( ! _expanded ) {
            scrollToComponent(_element,{
              offset: _scrollOffset,
              align: 'top',
              duration: 400,
            });
          }
          // _element.removeEventListener('transitionend', _scrollToElement, true);
        }
        /* _element.addEventListener(
          'transitionend',
          _scrollToElement,
          true
        ); */
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

  componentDidMount () {
    const header = document.querySelector('#app header');
    const headerHeight = header.offsetHeight;
    this.scrollOffset = headerHeight + 40;

    this.setState( (state) => ( {
        leftSidebarStyles: {
          ...state.leftSidebarStyles,
          top: this.scrollOffset,
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
      <div className="content-container content-container-02">
        <div className="row">
          <div className="col-sm-4">
            <div style={this.state.leftSidebarStyles}>
              <h2 dangerouslySetInnerHTML={ { __html: data.title.rendered } }></h2>
              <ul>
                { links.map( (link) => (
                    <li key={link.label}>
                      <span>{link.title}</span><br />
                      <a href={ link.type === 'page' ? link.page_url : link.file_url }>{  link.label }</a>
                    </li>
                  )
                ) }
              </ul>
            </div>
          </div>

          <div className="col-sm-8">

            <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } />

            {
              data.children.map(
                (child, index) => (
                  <div key={ child.id } >
                    <div className="child-content-container" style={ this.state.childrenStyles[index] } ref={ (element) => this._childrenRefs[index] = element }>
                      <h2 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                      <p dangerouslySetInnerHTML={ {__html: this.state.childContent[index] } } />
                    </div>
                    <div>
                      {
                        child.content_parts.length > 1 ?
                          <a onClick={this._onContentToggleHandler.bind(null, index)}>
                            { this.state.childContentExpanded[index] ? 'Collapse' : 'Expand' }
                          </a> : ''
                      }
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

ContentContainer02.propTypes = {
  data: PropTypes.object,
}

export default ContentContainer02;
