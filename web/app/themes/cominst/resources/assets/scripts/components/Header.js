import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = (props) => (
  <header>
    <div className="container">
      <h1 className="title">
        <Link to={props.homeUrl}>
          { props.title }
        </Link>
      </h1>
      { props.children }
    </div>
  </header>
)

Header.propTypes = {
  title: PropTypes.string,
  homeUrl: PropTypes.string,
  slogan: PropTypes.string,
  children: PropTypes.node,
}

export default Header;
