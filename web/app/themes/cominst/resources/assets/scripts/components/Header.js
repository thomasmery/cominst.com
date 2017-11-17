import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = (props) => (
  <header className={props.className} style={props.style}>
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
  className:PropTypes.string,
  style:PropTypes.object,
  children: PropTypes.node,
}

export default Header;
