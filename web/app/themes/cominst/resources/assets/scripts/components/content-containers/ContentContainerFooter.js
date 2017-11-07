import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerFooter = function( { data }) {
  return (
    <div className="row">
      <div className="col-sm-6">
        <div dangerouslySetInnerHTML={ { __html: data.map } } />
      </div>
      <div className="col-sm-6">
      <h3>Footer Content Container</h3>
      <p dangerouslySetInnerHTML={ { __html: data.contact_details } }/>
      <ul>
      {
        data.social_networks.map(
          (network) => <li key={network.name}><a href={network.url}>{network.name}</a></li>
        )
      }
      </ul>
      </div>
      <div className="col-sm-12">
        { data.site_name } { data.site_description }
      </div>
    </div>
    );
}

ContentContainerFooter.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerFooter;
