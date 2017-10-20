import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

class Nav extends Component {

  _renderNav () {
    return (
      <nav>
        { this.props.data.map(
            (item) => {
              return this._renderNavLink({
                path: item.path,
                title: item.title,
                slug: item.slug,
              })
            }
          )
        }
      </nav>
    );
  }

  _renderNavLink ({ path, title, slug }) {
    return (
      <Link
        key={ slug }
        to={ path }
        className={ classNames( { active: slug === this.props.activeSectionId } ) }
      >
          { title }
      </Link>
    );
  }

  render () {
    return this._renderNav();
  }

}

Nav.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSectionId: PropTypes.string,
}

export default Nav;
