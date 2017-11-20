import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class LangSwitcher extends Component {

  render () {
    return (
      <ul className="nav lang-switcher">
        {
          this.props.languages.map(
            (lang) => (
              <li
                key={lang.code}
                className={ classNames( { active: lang.code === this.props.activeLanguage } ) }
              >
                <a href={`/${lang.code}`} >{lang.code}</a>
              </li>
            )
          )
        }
      </ul>
    );
  }

}

LangSwitcher.propTypes = {
  activeLanguage: PropTypes.string,
  languages: PropTypes.array,
};

export default LangSwitcher;
