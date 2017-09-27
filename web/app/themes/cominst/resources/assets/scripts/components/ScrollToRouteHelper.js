/**
 * External dependencies
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

import scrollToComponent from 'react-scroll-to-component';

class ScrollToRouteHelper extends Component {

  componentDidMount() {

    const header = document.querySelector('#app header');
    const headerHeight = header.offsetHeight;
    const offset = -headerHeight;
    console.log(offset);// eslint-disable-line
    scrollToComponent(
      this.props.targetComponent,
      {
        ease: this.props.ease,
        duration: this.props.duration,
        offset: this.props.offset || offset,
        align: 'top',
      }
    );
  }
  render () { return null; }

}

ScrollToRouteHelper.propTypes = {
  targetComponent: PropTypes.object,
  duration: PropTypes.number,
  ease: PropTypes.string,
  offset: PropTypes.number,
}

ScrollToRouteHelper.defaultProps = {
  duration: 500,
  ease: 'out-quad',
}

export default ScrollToRouteHelper;
