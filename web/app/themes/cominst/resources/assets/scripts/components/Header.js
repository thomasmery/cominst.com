import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => (
  <header className={props.className} style={props.style}>
    <div className="container">
      { props.children }
    </div>
  </header>
)

Header.propTypes = {
  title: PropTypes.string,
  homeUrl: PropTypes.string,
  slogan: PropTypes.string,
  className:PropTypes.string,
  style:PropTypes.object,
  children: PropTypes.node,
}

export default Header;
