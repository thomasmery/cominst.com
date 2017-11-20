import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import classNames from 'classnames';

import scrollToComponent from 'react-scroll-to-component';

import Post from '../content-blocks/Post';
import Pagination from 'react-js-pagination';

class ContentContainerArchive extends Component {

  constructor (props) {
    super(props);

    this.scrollOffset = 0;

    this.state = {
      leftSidebarStyles: {
        position: 'sticky',
        top: 0,
      },
    }

    this._scrollToComponentTop = this._scrollToComponentTop.bind(this);

  }

  componentWillReceiveProps (nextProps) {
    if(this.props.siteHeaderHeight !== nextProps.siteHeaderHeight) {
      this.setState( (state) => (
        {
          leftSidebarStyles: {
            ...state.leftSidebarStyles,
            top: nextProps.siteHeaderHeight + 50, // 50 is the content-container paddingTop - should be dynamic

          },
        } )
      );
    }
    // if(this.props.data.posts !== nextProps.data.posts) {}
  }

  componentDidMount () {
    this.setState( (state) => (
        {
          leftSidebarStyles: {
            ...state.leftSidebarStyles,
            top: this.props.siteHeaderHeight + 20,
          },
        }
      )
    )
  }

  _scrollToComponentTop () {
    scrollToComponent(
      this,
      {
        offset: - this.props.siteHeaderHeight,
        align: 'top',
        duration: 300,
      }
    );
  }


  render () {
    const {
      data,
      history,
    } = this.props;
    const pages = [];
    for(let index = 1; index <= data.post_type.paging.totalPages; index++) {
      pages.push({
        index,
        path: data.post_type.categories && data.post_type.categories.length
          ? data.post_type.categories[0].path
          : data.post_type_archive_path,
      })
    }

    const spinner = data.isFetching
      ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>
      : '';

    return (
      <div className="content-container content-container-archive">
        <div className="row">
          <div className="col-sm-4 sidebar">
            <div style={this.state.leftSidebarStyles}>
              <div className="header">
                <h2
                  className="title"
                  dangerouslySetInnerHTML={ {
                    __html: `${data.title.rendered}`,
                  } }
                />
                <div className="spinner">
                  { spinner }
                </div>
              </div>
              <ul className="nav">
                <li
                  className={
                    classNames(
                      { active: ! data.post_type.categories || data.post_type.categories.length === 0 },
                      'item'
                    )
                  }
                  key={data.subtitle}
                >
                  <NavLink
                    activeClassName="active"
                    // we want to set the item as active if there is no active category for posts
                    isActive={ () => ! data.post_type.categories || data.post_type.categories.length === 0 }
                    to={data.post_type_archive_path}
                    onClick={ this._scrollToComponentTop }
                    dangerouslySetInnerHTML= { { __html: data.subtitle } }
                  />
                </li>
                {
                  Object.keys(data.taxonomies).map(
                    (taxonomy) => (
                          data.taxonomies[taxonomy].terms.map(
                            (term) => (
                              <li
                              className={
                                classNames(
                                  {
                                    active: data.post_type.categories
                                      && data.post_type.categories.filter( (category) => category.id === term.id).length,
                                  },
                                  'item'
                                )
                              }
                                key={term.slug}
                              >
                                <NavLink
                                  activeClassName="active"
                                  // we want to set the item as active if there is an active category for posts that matches the term.id
                                  isActive={ () => data.post_type.categories && data.post_type.categories.filter( (category) => category.id === term.id).length }
                                  to={term.path}
                                  onClick={ this._scrollToComponentTop }
                                  dangerouslySetInnerHTML= { { __html: term.name } }
                                />
                              </li>
                            )
                          )
                      )
                    )
                  }
              </ul>
            </div>
          </div>
          <div className={ classNames( { "is-fetching": data.isFetching }, 'col-sm-8 content')}>

            <div className="posts">
              {
                data.posts.map(
                  (post) => (
                    <Post
                      key={post.id}
                      data={post}
                      active={post.slug === data.active_post_slug }
                      postsListPath={data.posts_list_path}
                      history={this.props.history}
                    />
                  )
                )
              }
            </div>

            <div className="pagination-container">
              <Pagination
                activePage={parseInt(data.post_type.paging.currentPage)}
                itemsCountPerPage={this.props.data.posts_per_page}
                totalItemsCount={data.post_type.paging.total}
                pageRangeDisplayed={5}
                onChange={(index) => {
                    this._scrollToComponentTop()
                    history.push(`${pages[0].path}/page/${index}`);
                  }
                }

                innerClass="pagination"
                linkClassFirst="pagination-link pagination-link-first"
                linkClassPrev="pagination-link pagination-link-prev"
                linkClassNext="pagination-link pagination-link-next"
                linkClassLast="pagination-link pagination-link-last"
              />
            </div>

          </div>
        </div>
      </div>
      );
    }
}

ContentContainerArchive.propTypes = {
  data: PropTypes.object,
  siteHeaderHeight: PropTypes.number,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

ContentContainerArchive.defaultProps = {
  siteHeaderHeight: 0,
}

export default withRouter(ContentContainerArchive);
