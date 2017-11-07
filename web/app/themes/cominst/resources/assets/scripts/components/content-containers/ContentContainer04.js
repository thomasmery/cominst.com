import React from 'react';
import PropTypes from 'prop-types';

const ContentContainer04 = function({ data }) {
  return (
    <div className="content-container content-container-04">
      <h3>Gabarit 4</h3>
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

ContentContainer04.propTypes = {
  data: PropTypes.object,
}

export default ContentContainer04;
