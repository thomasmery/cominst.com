import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import ImagePreloader from 'image-preloader';

import Page from '../content-blocks/Page';

import scrollToComponent from 'react-scroll-to-component';

class ContentContainerPagesAndSidebarNavigation extends Component {

  constructor (props) {
    super(props);

    this.hasRootPageContent = props.data.acf.show_root_content && props.data.content.rendered !== '';

    this.state = {
      activeChildIndex: this.hasRootPageContent ? null : 0,
      activeChildTitle: this.hasRootPageContent || ! props.data.children.length ? this.props.data.subtitle : props.data.children[0].title.rendered,
      activeChildSubtitle: this.hasRootPageContent || ! props.data.children.length ? '' : props.data.children[0].subtitle,
      activeChildContent: this.hasRootPageContent || ! props.data.children.length ? props.data.content.rendered : props.data.children[0].introduction,
      activeChildImage: this.hasRootPageContent || ! props.data.children.length ? props.data.content.featured_media_html : props.data.children[0].featured_media_html,
      activeChildContentParts: this.hasRootPageContent || ! props.data.children.length ? props.data.content_parts : props.data.children[0].content_parts,
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

    this._sectionTitleClickHandler = this._sectionTitleClickHandler.bind(this);
    this._childTitleClickHandler = this._childTitleClickHandler.bind(this);
    this._onContentToggleHandler = this._onContentToggleHandler.bind(this);

  }

  _scrollToComponentTop () {

    const _scrollOffset = window.matchMedia("(max-width: 576px)").matches
    ? 20
    : 0;

    scrollToComponent(
      window.matchMedia("(max-width: 767px)").matches ? this._childContentContainerRef : this.props.parent,
      // this.props.parent,
      {
        offset: - this.props.siteHeaderHeight - _scrollOffset,
        align: 'top',
        duration: 300,
      }
    );
  }

  _setActiveChild (index) {

    this.setState( () => ( {
        activeChildIndex: index === null ? null : index,
        activeChildTitle: index === null ? this.props.data.subtitle : this.props.data.children[index].title.rendered,
        activeChildSubtitle: index === null ? '' : this.props.data.children[index].subtitle,
        activeChildContent: index === null ? this.props.data.content.rendered : this.props.data.children[index].introduction,
        activeChildImage: index === null ? this.props.data.content.featured_media_html : this.props.data.children[index].featured_media_html,
        activeChildContentParts: index === null ? this.props.data.content_parts : this.props.data.children[index].content_parts,
        childContentExpanded: false,
      } ),
      () => {
        // we need to detect when images in the content are actually loaded
        // before we set the height of the container
        // otherwise we might set it to a wring height and the content would be cut off
        if( ! this._childContentContainerRef ) {
          return;
        }
        const preloader = new ImagePreloader();
        const images = this._childContentContainerRef.querySelectorAll('img');
        const _component = this;
        preloader.preload.apply(this, images).then(() => {
            _component.setState( () => ( {
                activeChildContentStyles: {
                  height: _component._childContentContainerRef.children[0].clientHeight,
                },
              } )
            );
        });
      }
    )

    this._scrollToComponentTop();

  }

  _toggleChildContent () {
    this.setState( (state) => ( {
          activeChildContent: ! state.childContentExpanded ?
            this.props.data.children[state.activeChildIndex].content.rendered :
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

    this._scrollToComponentTop()

  }

  _sectionTitleClickHandler (index, event) {
    event.preventDefault();
    // don't do anything if we're requesting the Root Page content
    // but there is none ...
    if( ! this.hasRootPageContent) {
      return;
    }
    //
    this._childTitleClickHandler(index, event);
  }

  _childTitleClickHandler (index) {
    // event.preventDefault();
    this._setActiveChild(index);
    this.props.dataCallback(
      index !== null
        ? this.props.data.children[index]
        : this.props.data
    );
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
          height: this._childContentContainerRef && this._childContentContainerRef.children[0].clientHeight,
        },
      } )
    );

    // we want to activate the sub-section
    // if its slug is in the url
    const slug = this._getSubSectionSlug();
    const children_with_index = this.props.data.children.map((child, index) => ({ index, slug: child.slug }));
    const children = children_with_index.filter((child) => child.slug === slug);
    const child_index = children.length
      ? children[0].index
      : (this.hasRootPageContent || ! children_with_index.length ? null : 0);

    this._setActiveChild(child_index);
    // console.log(slug);//eslint-disable-line

    this.props.dataCallback(
      this.hasRootPageContent
      ? this.props.data
      : this.props.data.children[child_index]
    );
  }

  /**
   * get the sub page slug from the pathname if available
   */
  _getSubSectionSlug () {
    const match = this.props.location.pathname.match(this.props.parent.props.path);
    if(match) {
      const path_parts = this.props.location.pathname.replace(/^\/(.*)?\/$/, '$1').split('/');
      if(path_parts.length !== 3) {
        return;
      }
      return path_parts[path_parts.length - 1];
    }
  }

  /** Render */

  _renderNav() {
    const {
      data,
    } = this.props;

    return (
              <ul className="nav">
              {
                data.children.map(
                  (child, index) => (
                    <li
                      key={ child.id }
                      className="item">
                <Link
                  className={ classNames({ active: index === this.state.activeChildIndex }) }
                  to={`${this.props.parent.props.path}/${child.slug}`}
                  onClick={ this._childTitleClickHandler.bind(null, index) }
                  dangerouslySetInnerHTML={ {__html: child.title.rendered } }
                />
                    </li>
                  )
                )
              }
              </ul>
    )
  }

  render () {
    const {
      data,
    } = this.props;
    return (
      <div className="content-container content-container-pages-and-sidebar-navigation">
        <div className="row">
          <div className="col-md-12">
            {/* <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } /> */}
          </div>
          <div className="col-md-4 sidebar">
            <div style={this.state.leftSidebarStyles}>
              <h2
                dangerouslySetInnerHTML={ { __html: data.title.rendered } }
                onClick={ this._sectionTitleClickHandler.bind(null, null) }
                style= {{
                  cursor: this.hasRootPageContent ? 'pointer' : 'text',
                }}
              />
              { this._renderNav() }
            </div>
          </div>
          <div className="col-md-8 pages">
            {
              this.hasRootPageContent || data.children.length ?
                <div>
                  <div className="child-content-container" style={this.state.activeChildContentStyles} ref={ (element) => this._childContentContainerRef = element }>
                    <div>
                      <Page
                        title={ this.state.activeChildTitle }
                        subtitle={ this.state.activeChildSubtitle }
                        content={ this.state.activeChildContent }
                        contentParts={ this.state.activeChildContentParts}
                        contentExpanded={ this.state.childContentExpanded }
                        contentToggleHandler={ this._onContentToggleHandler }
                      />
                    </div>
                  </div>
                  <div className="child-image image" dangerouslySetInnerHTML={ { __html: this.state.activeChildImage } } />
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
  dataCallback: PropTypes.func,

  location: PropTypes.object,
}

ContentContainerPagesAndSidebarNavigation.defaultProps = {
  siteHeaderHeight: 0,
}

export default withRouter(ContentContainerPagesAndSidebarNavigation);
