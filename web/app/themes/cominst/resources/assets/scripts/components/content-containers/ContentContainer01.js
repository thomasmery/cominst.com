import React from 'react';
import PropTypes from 'prop-types';

const ContentContainer01 = function({ data }) {
  return (
    <div className="content-container content-container-01">
      <div className="row">
        <div className="col-sm-4">
          <ul>
            {
              data.children.map(
                (child) => (
                  <li key={ child.id }>
                    <a dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                  </li>
                )
              )
            }
          </ul>
        </div>
        <div className="col-sm-8">
          <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
        </div>
      </div>
    </div>
    );
}

ContentContainer01.propTypes = {
  data: PropTypes.object,
}

export default ContentContainer01;
