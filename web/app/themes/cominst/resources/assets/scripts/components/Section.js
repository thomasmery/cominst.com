import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {} from 'intersection-observer';
import Waypoint from 'react-waypoint';

class Section extends PureComponent {

  constructor (props) {
    super(props);

    this.state = {
      sectionStyles: props.sectionStyles,
    };

    this.backgroundImageUrl = '';

    this._onEnter = props.onEnter ? props.onEnter.bind(null, this) : () => {};
    this._onLeave = props.onLeave ? props.onLeave.bind(null, this) : () => {};

    this._switchBackground = this._switchBackground.bind(this);

  }

  _renderContent () {
    const {
      ContentContainer,
      data,
    } = this.props;

    return typeof ContentContainer === 'function'
      ? (
        <ContentContainer
          data={data}
          parent={this}
          siteHeaderHeight={this.props.siteHeaderHeight}
          dataCallback={this._switchBackground}
        />
       )
      : ContentContainer;

  }

  _switchBackground (child_data) {

    // we do not want a bg image for tablet portrait and mobile
    // as the visual aspect does not work well
    // and as the content stretches the container - the bg image is zoomed in / out and it feels weird
    if (window.matchMedia("(max-width: 767px)").matches) {
      return false;
    }

    /**
     * a background image is only displayed if a featured image has been set
     * if not and one is in place, it is removed
     */

    let image_url = null;
    if (child_data.featured_media_metadata && child_data.featured_media_metadata.sizes) {
      image_url = child_data.featured_media_metadata.sizes.xl
        ? child_data.featured_media_metadata.sizes.xl.url
        : child_data.featured_media_metadata.sizes.original.url;
    }

    this.backgroundImageUrl = image_url;
    const backgroundImage = image_url ? `url(${this.backgroundImageUrl})` : 'none';
    if(this.state.sectionStyles.backgroundImage) {
      this.setState( (state) => ({
        sectionStyles: {
          ...state.sectionStyles,
          backgroundImage,
        },
      }));
    }
  }

  componentDidMount () {

    const inViewportObserverOptions = {
      root: null,
      rootMargin: '10px 0px -10px 0px',
      threshold: 0,
    }

    const inViewportObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          if(!this.state.sectionStyles.backgroundImage) {
            this.setState( (state) => ({
              sectionStyles: {
                ...state.sectionStyles,
                backgroundImage: `url(${this.backgroundImageUrl})`,
              },
            }));
          }
        }
      });
    }

    const inViewportObserver = new IntersectionObserver(inViewportObserverCallback, inViewportObserverOptions);
    inViewportObserver.observe(document.querySelector(`#${this.props.id}`));

  }

  render () {
    return (
      <Waypoint
        onEnter={ this._onEnter }
        onLeave={ this._onLeave }
        topOffset={400}
        bottomOffset={400}
      >
        <section
          id={this.props.id}
          className={ this.props.className }
          style={this.state.sectionStyles}
        >
          <div className={ this.props.containerClassName }>
            {/* <h2>{ this.props.title }</h2> */}
            <div className="section-content">
              { this.props.children }
              { this._renderContent() }
            </div>
          </div>

          <div className="scroll-hint">{this.props.scrollHintElement}</div>
        </section>
      </Waypoint>
    );
  }
}

Section.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  sectionStyles: PropTypes.object,
  title: PropTypes.string,
  data: PropTypes.object,
  ContentContainer: PropTypes.oneOfType([PropTypes.element,PropTypes.func]).isRequired,
  siteHeaderHeight: PropTypes.number,
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  scrollHintElement: PropTypes.node,
  allowBackgroundToLoad: PropTypes.bool,
}

Section.defaultProps = {
  sectionStyles: {},
}

export default Section;
