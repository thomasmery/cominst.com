import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerReferences = function({ data }) {
  return (
    <div className="content-container list-and-modal">
      <h3>References</h3>
      <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
      {
        data.items.map(
          (item) => (
            <div key={ item.id } className="main-list">
              <h4 dangerouslySetInnerHTML={ {__html: item.title } } />
              <ul className="chidren-list">
                { item.sub_items.map( (sub_item) => (
                      <li key={sub_item.id}>
                        { sub_item.title }
                      </li>
                    )
                  )
                }
              </ul>
            </div>
          )
        )
      }
    </div>
    );
}

ContentContainerReferences.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerReferences;
