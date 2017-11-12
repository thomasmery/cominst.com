/**
 * External dependencies
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

import scrollToComponent from 'react-scroll-to-component';

class ScrollToRouteHelper extends Component {

  _scrollToComponent () {

    scrollToComponent(
      this.props.targetComponent,
      {
        ease: this.props.ease,
        duration: this.props.duration,
        offset: - this.props.offset || 0,
        align: 'top',
      }
    );
  }

  componentDidMount() {
    this._scrollToComponent();
  }

  render () { return null; }

}

ScrollToRouteHelper.propTypes = {
  targetComponent: PropTypes.object,
  duration: PropTypes.number,
  ease: PropTypes.string,
  offset: PropTypes.number,
  location: PropTypes.object,
}

ScrollToRouteHelper.defaultProps = {
  duration: 500,
  ease: 'out-quad',
}

export default ScrollToRouteHelper;
