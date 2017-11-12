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

    const itemsContainerHeight = index !== null ? this.sub_items_containers_refs[index].clientHeight : 'auto';

    this.setState( () => ({
        activeItemIndex: index,
        itemsContainerHeight,
      })
    );

    scrollToComponent(
      this,
      {
        offset: - this.props.siteHeaderHeight,
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
    this._setActiveItem(index);
  }

  _itemCloseButtonOnClickHandler (event) {
      event.preventDefault();
      this._resetActiveItem ();
  }

  render () {
    const {
      data,
    } = this.props;

    return (
      <div className="content-container content-container-list-and-modal">
        <div className="row">
          <div className="col-sm-4">
            <h2 dangerouslySetInnerHTML={ { __html: data.title.rendered } }></h2>
          </div>
          <div className="col-sm-8">
            <p dangerouslySetInnerHTML={ { __html: data.content.rendered } } />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <ul className="items" style={ { height: this.state.itemsContainerHeight || 'auto' } }>
              {
                data.items.map(
                  (item, index) => (
                    <li key={ item.id } className={classNames({ active: this.state.activeItemIndex === index }, 'item')}>
                      <a href="#" onClick={this._itemOnClickHandler.bind(null, index) } dangerouslySetInnerHTML={ {__html: item.title } } />
                      <div className="sub-items-container" ref={ (element) => this.sub_items_containers_refs[index] = element }>
                        <span onClick={this._itemCloseButtonOnClickHandler } className="button-close">X</span>
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
