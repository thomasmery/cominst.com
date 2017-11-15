import React,{ Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import ReactSwipe from 'react-swipe';

class ContentContainerCarousel extends Component {

  constructor (props) {
    super(props);

    this.state = {
      sideImagesAnimationClass: null,
      carouselCurrentIndex: 0,
      carouselPreviousIndex: this.props.data.children.length - 1,
      carouselNextIndex: 1,
    }

    this._onPreviousButtonClickHandler = this._onPreviousButtonClickHandler.bind(this);
    this._onNextButtonClickHandler = this._onNextButtonClickHandler.bind(this);

  }

  showPreviousSlide() {
    this.carousel.prev()
  }

  showNextSlide() {
    this.carousel.next()
  }

  _onPreviousButtonClickHandler () {
    this.showPreviousSlide();
  }

  _onNextButtonClickHandler () {
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
        _this.setState( {
            sideImagesAnimationClass: 'hidden',
          }
        )
      },
      transitionEnd(index) {
        _this.setState( () => ({
          sideImagesAnimationClass: null,
          carouselCurrentIndex: index,
          carouselPreviousIndex: index === 0 ? _this.props.data.children.length - 1 : index - 1,
          carouselNextIndex: index === _this.props.data.children.length - 1 ? 0 : index + 1,
        }))
      },
    }

    return data.children.length ? (
      <div  className="content-container content-container-carousel" style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          className="carousel-side-panel carousel-side-panel-left"
          style={{ flex: '1 0 300px', maxWidth: 300 }}
          onClick={this._onPreviousButtonClickHandler}
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
        <div className="container carousel-center-panel" style={{ flex: '1 0 auto', margin: 0 }}>
          <ReactSwipe
            key={data.children.length}
            ref={ (element) => this.carousel = element }
            swipeOptions={swipeOptions}
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
                        <div className={ classNames({ "content-full-width": ! child.featured_media_html }, 'content') }>
                          <h3 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                          {
                            child.subtitle
                              && <h4 className="subtitle" dangerouslySetInnerHTML={ {__html: child.subtitle } } />
                          }
                          <p dangerouslySetInnerHTML={ {__html: child.content.rendered } } />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </ReactSwipe>
        </div>
        <div
          className="carousel-side-panel carousel-side-panel-right"
          style={{ flex: '1 0 300px', maxWidth: 300 }}
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
}

export default ContentContainerCarousel;
