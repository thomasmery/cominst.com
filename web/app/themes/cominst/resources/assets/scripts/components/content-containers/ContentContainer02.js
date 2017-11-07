import React from 'react';
import PropTypes from 'prop-types';

const ContentContainer02 = function({ data }) {
  const links = data.acf.links || [];
  return (
    <div>
      <div className="row">
        <div className="col-sm-4">
          <ul>
            { links.map( (link) => (
                <li key={link.label}>
                  <span>{link.title}</span><br />
                  <a href={ link.type === 'page' ? link.page_url : link.file_url }>{  link.label }</a>
                </li>
              )
            ) }
          </ul>
        </div>

        <div className="col-sm-8">

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
      </div>
    </div>
    );
}

ContentContainer02.propTypes = {
  data: PropTypes.object,
}

export default ContentContainer02;
