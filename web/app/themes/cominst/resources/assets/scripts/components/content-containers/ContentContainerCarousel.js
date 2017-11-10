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
        <div style={{ flex: '1 0 200px', maxWidth: 200 }}>
            <div
              className={ classNames( this.state.sideImagesAnimationClass, 'image')}
              dangerouslySetInnerHTML={ {__html: data.children[this.state.carouselPreviousIndex].featured_media_html } }
              onClick={this._onPreviousButtonClickHandler}
            />
        </div>
        <div className="container" style={{ flex: '1 0 auto', margin: 0 }}>
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
                      <div className="col-sm-3">
                        <div className="image" dangerouslySetInnerHTML={ {__html: child.featured_media_html } } />
                      </div>
                      <div className="col-sm-9">
                        <h2 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                        <p dangerouslySetInnerHTML={ {__html: child.content.rendered } } />
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </ReactSwipe>
        </div>
        <div style={{ flex: '1 0 200px', maxWidth: 200 }}>
          <div
            className={ classNames( this.state.sideImagesAnimationClass, 'image')}
            dangerouslySetInnerHTML={ {__html: data.children[this.state.carouselNextIndex].featured_media_html } }
            onClick={this._onNextButtonClickHandler}
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
