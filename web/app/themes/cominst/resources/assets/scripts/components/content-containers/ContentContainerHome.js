import React from 'react';
import PropTypes from 'prop-types';

const ContentContainerHome = function({ data, scrollHintElement }) {
  return (
    <div className="container content-container content-container-home">
      <div dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
      <div className="scroll-hint">{scrollHintElement}</div>
    </div>
    );
}

ContentContainerHome.propTypes = {
  data: PropTypes.object,
  scrollHintElement: PropTypes.element,
}

export default ContentContainerHome;
