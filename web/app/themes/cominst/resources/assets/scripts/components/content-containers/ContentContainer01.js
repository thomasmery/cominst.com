import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ScrollToRouteHelper from '../ScrollToRouteHelper';

class ContentContainer01 extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeChildIndex: 0,
      activeChildContent: this.props.data.children[0].introduction,
      childContentExpanded: false,
      navStyles: {
        position: 'sticky',
        top: 0,
      },
    }

    this.allowScrollToTopOfSection = false;

    this._childTitleClickHandler = this._childTitleClickHandler.bind(this);
    this._onContentToggleHandler = this._onContentToggleHandler.bind(this);

  }

  _setActiveChild (index) {
    this.setState( () => ( {
      activeChildIndex: index,
      activeChildContent: this.props.data.children[index].introduction,
      childContentExpanded: false,
    } ) )
  }

  _toggleChildContent () {
    this.setState( (state) => ( {
          activeChildContent: ! state.childContentExpanded ?
            this.props.data.children[state.activeChildIndex].body :
            this.props.data.children[state.activeChildIndex].introduction,
          childContentExpanded: ! state.childContentExpanded,
      } )
    )

    this.allowScrollToTopOfSection = true;

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
    const offset = headerHeight + 40;
    this.setState( (state) => ( {
        navStyles: {
          ...state.navStyles,
          top: offset,
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
        { this.state.childContentExpanded === false && this.allowScrollToTopOfSection ?
            <ScrollToRouteHelper ease="in-out-quad" duration={500} targetComponent={this} /> : ''
        }
        <div className="row">
          <div className="col-sm-12">
            {/* <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } /> */}
          </div>
          <div className="col-sm-4">
            <div style={this.state.navStyles}>
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
          <div className="col-sm-8 sub-page-content-container">
            <h3 className="sub-page-title" dangerouslySetInnerHTML={ { __html: data.children[this.state.activeChildIndex].title.rendered } } />
            <div className="sub-page-content" dangerouslySetInnerHTML={ { __html: this.state.activeChildContent } } />
            <div>
              {
                data.children[this.state.activeChildIndex].content_parts.length > 1 ?
                  <a onClick={this._onContentToggleHandler}>
                    { this.state.childContentExpanded ? 'Collapse' : 'Expand' }
                  </a> : ''
              }
            </div>
            <div className="sub-page-image image" dangerouslySetInnerHTML={ { __html: data.children[this.state.activeChildIndex].featured_media_html || data.featured_media_html } } />
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
