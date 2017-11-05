import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import Pagination from 'react-js-pagination';

const ContentContainerArchive = function({ data, history }) {
  const pages = [];
  for(let index = 1; index <= data.post_type.paging.totalPages; index++) {
    pages.push({
      index,
      path: data.post_type.categories && data.post_type.categories.length ? data.post_type.categories[0].path : data.post_type_archive_path,
    })
  }
  return (
    <div>
      <h3>Content Container Archive { data.isFetching ? <span>LOADING</span> : '' }</h3>

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

      {
        data.posts.map(
          (post) => (
            <div key={ post.id }>
              <h5 dangerouslySetInnerHTML={ {__html: post.title.rendered } } />
            </div>
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

      {/* <ul>
      {
        data.post_type.paging.currentPage > 1 ? (
          <li key="prev">
          <NavLink
            to={`${pages[0].path}/page/${pages[0].index}`}
            isActive={ () => data.post_type.paging.currentPage == pages[0].index } // paging values can be strings ... so: abstract equals ...
            activeStyle={ { color: 'red' } }
          >
            &lt;
          </NavLink>
        </li>
        ) : ''
      }

      {
        pages.map(
          (page) => (
            <li key={page.index}>
              <NavLink
                to={`${page.path}/page/${page.index}`}
                isActive={ () => data.post_type.paging.currentPage == page.index } // paging values can be strings ... so: abstract equals ...
                activeStyle={ { color: 'red' } }
              >
                {page.index}
              </NavLink>
            </li>
          )
        )
      }
      </ul> */}

    </div>
    );
}

ContentContainerArchive.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ContentContainerArchive);
