import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerTaxonomy = function({ data }) {
  return (
    <div>
      <h3>Content Container Taxonomy</h3>
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

ContentContainerTaxonomy.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerTaxonomy;
