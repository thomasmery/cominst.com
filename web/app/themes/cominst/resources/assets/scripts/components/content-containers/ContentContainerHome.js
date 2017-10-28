import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerHome = function({ data }) {
  return (
    <div>
      <h3>Home Content Container</h3>
      <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
      <p>{data.acf.content_template}</p>
      {
        data.children.map(
          (child) => (
            <div key={ child.id }>
              <h5 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
            </div>
          )
        )
      }
    </div>
    );
}

ContentContainerHome.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerHome;
