import React from 'react';
import PropTypes from 'prop-types';

const ContentContainer02 = function({ data }) {
  return (
    <div>
      <h3>Gabarit 2</h3>
      <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
      {
        data.children.map(
          (child) => (
            <div key={ child.id }>
              <h2 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
              <p dangerouslySetInnerHTML={ {__html: child.content.rendered } } />
            </div>
          )
        )
      }
    </div>
    );
}

ContentContainer02.propTypes = {
  data: PropTypes.object,
}

export default ContentContainer02;
