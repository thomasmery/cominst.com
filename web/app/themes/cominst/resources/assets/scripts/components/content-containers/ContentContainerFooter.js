import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerFooter = function( { data }) {
  return (
    <div className="content-container content-container-footer">
      <div className="row content">
        <div className="col-sm-8 col-left">
          <div className="map-container" dangerouslySetInnerHTML={ { __html: data.map } } />
        </div>
        <div className="col-sm-4 col-right">

          <div className="block">
            <h3>Nos coordonnées</h3>
            <p dangerouslySetInnerHTML={ { __html: data.contact_details } }/>
          </div>

          <div className="block">
            <h3>Nous suivre</h3>
            <ul className="social-networks">
            {
              data.social_networks.map(
                (network) => (
                  <li className="item" key={network.name}>
                    <a href={network.url} target="_blank">
                      <i className={`icon fa fa-${network.name.toLowerCase()}-square`} aria-hidden="true"></i>
                    </a>
                  </li>
                )
              )
            }
            </ul>
          </div>

          <div className="block">
            <h3>Newsletter</h3>
          </div>

        </div>
      </div>
      <div className="row signature">
        <div className="col-sm-12">
          © { data.site_name } - { data.site_description }
        </div>
      </div>
    </div>
    );
}

ContentContainerFooter.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerFooter;
