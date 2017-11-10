import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

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
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.data.posts !== nextProps.data.posts) {
      scrollToComponent(
        this,
        {
          offset: - this.scrollOffset,
          align: 'top',
          duration: 300,
        }
      );
    }
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
      } )
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
        path: data.post_type.categories && data.post_type.categories.length ? data.post_type.categories[0].path : data.post_type_archive_path,
      })
    }
    return (
      <div className="content-container content-container-01">
        <div className="row">
          <div className="col-sm-4">
            <div style={this.state.leftSidebarStyles}>
              <h3>Actualités { data.isFetching ? <span>LOADING</span> : '' }</h3>

              <ul>
                <li key={data.post_type.name}>
                  <NavLink
                    activeStyle={ { color: 'red' } }
                    // we want to set the item as active if there is no active category for posts
                    isActive={ () => ! data.post_type.categories || data.post_type.categories.length === 0 }
                    to={data.post_type_archive_path}
                    dangerouslySetInnerHTML= { { __html: data.post_type.name } }
                  />
                </li>
                {
                  Object.keys(data.taxonomies).map(
                    (taxonomy) => (
                          data.taxonomies[taxonomy].terms.map(
                            (term) => (
                              <li key={term.slug}>
                                <NavLink
                                  activeStyle={ { color: 'red' } }
                                  // we want to set the item as active if there is an active category for posts that matches the term.id
                                  isActive={ () => data.post_type.categories && data.post_type.categories.filter( (category) => category.id === term.id).length }
                                  to={term.path}
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
          <div className="col-sm-8">

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

            <Pagination
              activePage={parseInt(data.post_type.paging.currentPage)}
              itemsCountPerPage={3}
              totalItemsCount={data.post_type.paging.total}
              pageRangeDisplayed={10}
              onChange={(index) => history.push(`${pages[0].path}/page/${index}`)}
            />

          </div>
        </div>
      </div>
      );
    }
}

ContentContainerArchive.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ContentContainerArchive);
