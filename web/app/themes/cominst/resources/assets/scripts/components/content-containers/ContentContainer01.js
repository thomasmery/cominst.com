import React from 'react';
import PropTypes from 'prop-types';

const ContentContainer01 = function({ data }) {
  return (
    <div>
      <h3>Gabarit 1</h3>
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

ContentContainer01.propTypes = {
  data: PropTypes.object,
}

export default ContentContainer01;
