import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerArchive = function({ data }) {
  return (
    <div>
      <h3>Content Container Archive</h3>
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
