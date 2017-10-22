import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = (props) => (
  <header>
    <div className="container">
      <Link to={props.homeUrl}>
        <h1>{ props.title }</h1>
      </Link>
      { props.children }
    </div>
  </header>
)

Header.propTypes = {
  title: PropTypes.string,
  homeUrl: PropTypes.string,
  children: PropTypes.node,
}

export default Header;
