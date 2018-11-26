/* global appData */
import React from 'react';
import PropTypes from 'prop-types';

import MailchimpSubscribeForm from '../tools/MailchimpSubscribeForm';

const ContentContainerFooter = function( { data }) {

  try {
    if ( ! data.mailchimp_subscribe_url ) {
      throw new Error('You must define a mailchimp_subscribe_url for your site');
    }
  }
  catch (error) {
    console.warn(error.message); // eslint-disable-line no-console
  }

  return (
    <div className="content-container content-container-footer">
      <div className="row content">
        <div className="col-md-8 col-left">
          <a href={ data.map || '#' } target="_blank" rel="noopener noreferrer" className="map-container" />
          {/* <div className="map-container" dangerouslySetInnerHTML={ { __html: data.map } } /> */}
        </div>
        <div className="col-md-4 col-right">

          <div className="block contact-details-container">
            <h3>{appData.i18n.contact_details}</h3>
            <p dangerouslySetInnerHTML={ { __html: data.contact_details } }/>
          </div>

          <div className="block">
            <a href={ data.map || '#' } target="_blank" rel="noopener noreferrer" className="map-container" />
          </div>

          <div className="block social-networks-container">
            <h3>{appData.i18n.follow_us}</h3>
            <ul className="social-networks">
            {
              data.social_networks.map(
                (network) => (
                  <li className="item" key={network.name}>
                    <a href={network.url} target="_blank"rel="noopener noreferrer">
                      <i className={`icon fa fa-${network.name.toLowerCase()}-square`} aria-hidden="true"></i>
                    </a>
                  </li>
                )
              )
            }
            </ul>
          </div>

          <div className="block block-newsletters-container">
            <h3>{appData.i18n.newsletter}</h3>
              <MailchimpSubscribeForm
                className="form-container"
                action={data.mailchimp_subscribe_url}
                messages = {{
                  inputPlaceholder: appData.i18n.newsletterSubscribeForm.inputPlaceholder,
                  btnLabel: appData.i18n.newsletterSubscribeForm.btnLabel,
                  sending: appData.i18n.newsletterSubscribeForm.sending,
                  success: appData.i18n.newsletterSubscribeForm.success,
                  error: appData.i18n.newsletterSubscribeForm.error,
                }}
              />
            </div>
        </div>
      </div>
      <div className="row signature">
        <div className="col-sm-12">
          <span className="site-name">© { data.site_name }</span> <span className="separator">-</span> <span className="site-description">{ data.site_description }</span>
        </div>
      </div>
    </div>
    );
}

ContentContainerFooter.propTypes = {
  data: PropTypes.object,
}

export default ContentContainerFooter;
