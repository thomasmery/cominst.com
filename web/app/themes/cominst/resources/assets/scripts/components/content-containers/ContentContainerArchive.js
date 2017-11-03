import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ContentContainerArchive = function({ data }) {
  return (
    <div>
      <h3>Content Container Archive</h3>
      { data.isFetching ? <h1>FETCHING</h1> : '' }
      {
        Object.keys(data.taxonomies).map(
          (taxonomy) => (
            <ul key={ taxonomy }>
              {
                data.taxonomies[taxonomy].terms.map(
                  (term) => (
                    <li key={term.slug}>
                      <Link to={term.path} dangerouslySetInnerHTML= { { __html: term.name } } />
                    </li>
                  )
                )
              }
            </ul>
          )
        )
      }
      {
        data.posts.map(
          (post) => (
            <div key={ post.id }>
              <h5 dangerouslySetInnerHTML={ {__html: post.title.rendered } } />
            </div>
          )
        )
      }
    </div>
    );
}

ContentContainerArchive.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerArchive;
