import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import scrollToComponent from 'react-scroll-to-component';

class ContentContainerListAndModal extends Component {

  constructor (props) {
    super(props);

    this.sub_items_containers_refs = [];

    this.state = {
      activeItemIndex: null,
    }

    this._itemOnClickHandler = this._itemOnClickHandler.bind(this);
    this._resetActiveItem = this._resetActiveItem.bind(this);
    this._itemCloseButtonOnClickHandler = this._itemCloseButtonOnClickHandler.bind(this);

  }

  _setActiveItem (index) {

    if(index !== null) {
      this.originalItemsContainerHeight = this._listRef.clientHeight;
    }

    const itemsContainerHeight =
      index !== null
        ? this.sub_items_containers_refs[index].clientHeight
        : this.originalItemsContainerHeight;

    this.setState( () => ({
        activeItemIndex: index,
        itemsContainerHeight,
      })
    );

    scrollToComponent(
      this._listContainerRef,
      {
        offset: - this.props.siteHeaderHeight - 20,
        align: 'top',
        duration: 300,
      }
    );

  }

  _resetActiveItem () {
    this._setActiveItem(null);
  }

  _itemOnClickHandler (index, event) {
    event.preventDefault();
    console.log('ITEM CLICKED'); // eslint-disable-line
    this._setActiveItem(index);
  }

  _itemCloseButtonOnClickHandler (event) {
      event.preventDefault();
      event.stopPropagation();
      this._resetActiveItem ();
  }

  render () {
    const {
      data,
    } = this.props;

    return (
      <div className="content-container content-container-list-and-modal">
        <div className="row">
          <div className="col-sm-4 sidebar">
            <h2 dangerouslySetInnerHTML={ { __html: data.title.rendered } }></h2>
          </div>
          <div className="col-sm-8">
            <div className="page-content" dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
          </div>
        </div>
        <div className="row">
          <div
            className="col-sm-12 list-container"
            ref={ (element) => this._listContainerRef = element }
          >
            <h3 className="list-header" dangerouslySetInnerHTML={ { __html: data.subtitle } } />
            <ul
              className="items"
              style={ { height: this.state.itemsContainerHeight || 'auto' } }
              ref={ (element) => this._listRef = element }
            >
              {
                data.items.map(
                  (item, index) => (
                    <li
                      key={ item.id }
                      className={classNames({ active: this.state.activeItemIndex === index }, 'item')}
                      onClick={this._itemOnClickHandler.bind(null, index) }
                    >
                      <span dangerouslySetInnerHTML={ {__html: item.title } } />
                      <div
                        className="sub-items-container"
                        ref={ (element) => this.sub_items_containers_refs[index] = element }
                        onClick={ (event) => event.stopPropagation() }
                      >
                        <span onClick={this._itemCloseButtonOnClickHandler } className="button-close">
                          <svg width="23px" height="22px" viewBox="0 0 23 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
                                <g id="close" transform="translate(11.500000, 10.500000) rotate(-45.000000) translate(-11.500000, -10.500000) translate(-2.000000, -3.000000)" stroke="#666666" strokeWidth="2">
                                    <path d="M0.0649711575,13.5 L26.0649712,13.5" id="Line-2"></path>
                                    <path d="M13.5,26.9350288 L13.5,0.935028843" id="Line-2-Copy"></path>
                                </g>
                            </g>
                          </svg>
                        </span>
                        <div className="row">
                          <div className="col-sm-6 image">
                            <div dangerouslySetInnerHTML= { { __html: item.image_html } } />
                          </div>
                          <div className="col-sm-6">
                            <h4>{ item.title }</h4>
                            <ul className="sub-items">
                              { item.sub_items.map( (sub_item) => (
                                    <li key={sub_item.id} className="sub-item">
                                      { sub_item.title }
                                    </li>
                                  )
                                )
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                )
              }
            </ul>
          </div>
        </div>

      </div>
      );
    }
}

ContentContainerListAndModal.propTypes = {
  data: PropTypes.object,
  siteHeaderHeight: PropTypes.number,
}

ContentContainerListAndModal.defaultProps = {
  siteHeaderHeight: 0,
}

export default ContentContainerListAndModal;
