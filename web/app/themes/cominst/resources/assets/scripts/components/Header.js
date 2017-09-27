import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => (
  <header>
    <div className="container">
      <h1>{ props.title }</h1>
      { props.children }
    </div>
  </header>
)

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

export default Header;
