import React,{ Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import scrollToComponent from 'react-scroll-to-component';

import ReactSwipe from 'react-swipe';

class ContentContainerCarousel extends Component {

  constructor (props) {
    super(props);

    this.state = {
      sideImagesAnimationClass: null,
      centerPanelClass: null,
      swipeContainerHeight: 'auto',
      carouselCurrentIndex: 0,
      carouselPreviousIndex: this.props.data.children.length - 1,
      carouselNextIndex: 1,
    }

    this._onPrevButtonClickHandler = this._onPrevButtonClickHandler.bind(this);
    this._onNextButtonClickHandler = this._onNextButtonClickHandler.bind(this);

  }

  showPreviousSlide() {
    this.carousel.prev()
  }

  showNextSlide() {
    this.carousel.next()
  }

  _onPrevButtonClickHandler (event) {
    event.preventDefault();
    this.showPreviousSlide();
  }

  _onNextButtonClickHandler (event) {
    event.preventDefault();
    this.showNextSlide();
  }

  render () {

    const _this = this;

    const {
      data,
    } = this.props;

    const swipeOptions = {
      speed: 400,
      callback(index) {// eslint-disable-line

        const _active_slide_element = _this.carousel.container.querySelectorAll('[data-index]')[index];

        _this.setState( {
            sideImagesAnimationClass: 'hidden',
            centerPanelClass: 'sliding',
            swipeContainerHeight: _active_slide_element.clientHeight + 70,
          }
        )
      },
      transitionEnd(index) {
        _this.setState( () => ({
          sideImagesAnimationClass: null,
          centerPanelClass: null,
          carouselCurrentIndex: index,
          carouselPreviousIndex: index === 0 ? _this.props.data.children.length - 1 : index - 1,
          carouselNextIndex: index === _this.props.data.children.length - 1 ? 0 : index + 1,
        }));

        scrollToComponent(
          _this,
          {
            offset: - _this.props.siteHeaderHeight,
            align: 'top',
            duration: 300,
          }
        );
      },
    }

    return data.children.length ? (
      <div  className="content-container content-container-carousel">
        <div
          className="carousel-side-panel carousel-side-panel-left"
          onClick={this._onPrevButtonClickHandler}
        >
            <div className="button-navigation button-navigation-left">
              <svg width="16px" height="29px" viewBox="0 0 16 29" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
                  <g id="chevron-left" transform="translate(7.500000, 15.000000) rotate(-270.000000) translate(-7.500000, -15.000000) translate(-5.500000, 8.000000)" stroke="#666666" strokeWidth="2">
                      <path d="M19.1956787,19.2965088 C19.1956787,19.2965088 14.8960368,14.9563395 6.29675293,6.27600098 L19.1956787,-6.19543457" id="Line" transform="translate(12.746216, 6.550537) rotate(-90.000000) translate(-12.746216, -6.550537) "></path>
                  </g>
                </g>
              </svg>
          </div>
            <div
              className={ classNames( this.state.sideImagesAnimationClass, 'image')}
              dangerouslySetInnerHTML={ {__html: data.children[this.state.carouselPreviousIndex].featured_media_html } }
            />
        </div>
        <div
          className={ classNames( this.state.centerPanelClass, 'container carousel-center-panel')}
        >
          <div className="row">
            <div className="col-sm-12">
              <ReactSwipe
                key={data.children.length}
                ref={ (element) => this.carousel = element }
                swipeOptions={swipeOptions}
                style={{
                  container: {
                    overflow: 'hidden',
                    visibility: 'hidden',
                    position: 'relative',
                    height: this.state.swipeContainerHeight,
                    transition: 'height 0.2s ease-out',
                    },
                    wrapper: {
                      overflow: 'hidden',
                      position: 'relative',
                    },
                    child: {
                      float: 'left',
                      width: '100%',
                      position: 'relative',
                      transitionProperty: 'transform',
                    },
                  }}
              >
                {
                  data.children.map(
                    (child) => (
                      <div key={ child.id }>
                        <div className="row">
                          {
                            child.featured_media_html
                            && (
                              <div className="col-sm-3">
                                <div className="image" dangerouslySetInnerHTML={ {__html: child.featured_media_html } } />
                              </div>
                            )
                          }
                          <div className={child.featured_media_html ? "col-sm-9" : "col-sm-12"}>
                            <div className={ classNames({ "content-full-width": ! child.featured_media_html }, 'child-content-container') }>
                              <div>
                                <div className="header">
                                  <h3 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                                  {
                                    child.subtitle
                                      && <h4 className="subtitle" dangerouslySetInnerHTML={ {__html: child.subtitle } } />
                                  }
                                </div>
                                <div className="content">
                                  <div className="introduction" dangerouslySetInnerHTML={ {__html: child.introduction } } />
                                  <div className="body" dangerouslySetInnerHTML={ {__html: child.body } } />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                }
              </ReactSwipe>
              <div className="row navigation navigation-mobile">
                <div className="col-6 text-left">
                  <a
                    href="#"
                    onClick={this._onPrevButtonClickHandler}
                  >
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="col-6 text-right">
                  <a
                    href="#"
                    onClick={this._onNextButtonClickHandler}
                  >
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="carousel-side-panel carousel-side-panel-right"
          onClick={this._onNextButtonClickHandler}
        >
          <div className="button-navigation button-navigation-right">
            <svg width="16px" height="29px" viewBox="0 0 16 29" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
                  <g id="chevron-right" transform="translate(8.500000, 14.500000) rotate(-90.000000) translate(-8.500000, -14.500000) translate(-5.000000, 7.500000)" stroke="#666666" strokeWidth="2">
                      <path d="M19.6870117,19.3181152 C19.6870117,19.3181152 15.3873698,15.1402995 6.78808594,6.78466797 L19.6870117,-6.21704102" id="Line" transform="translate(13.237549, 6.550537) rotate(-90.000000) translate(-13.237549, -6.550537) "></path>
                  </g>
              </g>
            </svg>
          </div>
          <div
            className={ classNames( this.state.sideImagesAnimationClass, 'image')}
            dangerouslySetInnerHTML={ {__html: data.children[this.state.carouselNextIndex].featured_media_html } }
          />
        </div>
      </div>
    ) : <div>NOTHING TO SHOW HERE</div>;
  }
}

ContentContainerCarousel.propTypes = {
  data: PropTypes.object,
  siteHeaderHeight: PropTypes.number,
}

export default ContentContainerCarousel;
