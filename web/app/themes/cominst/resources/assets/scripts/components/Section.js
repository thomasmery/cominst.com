import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Waypoint from 'react-waypoint';

class Section extends PureComponent {

  constructor (props) {
    super(props);

    this._onEnter = props.onEnter ? props.onEnter.bind(null, this) : () => {};
    this._onLeave = props.onLeave ? props.onLeave.bind(null, this) : () => {};

  }

  _renderContent () {
    switch (this.props.data.type) {
      case 'page':
      case 'post':
        return (
          <div>
            <p dangerouslySetInnerHTML={ { __html: this.props.data.content.rendered } } />
            {
              this.props.data.children.map(
                (child) => (
                  <div key={ child.id }>
                    <h3 dangerouslySetInnerHTML={ {__html: child.title.rendered } } />
                    <p dangerouslySetInnerHTML={ {__html: child.content.rendered } } />
                  </div>
                )
              )
            }
          </div>
        );
      case 'taxonomy':
        return 'THIS IS A TAXONOMY';
    }
  }

  render () {
    return (
      <Waypoint
        onEnter={ this._onEnter }
        onLeave={ this._onLeave }
        topOffset={400}
        bottomOffset={400}
      >
        <section id={this.props.id} style={ { minHeight: 400, border: 'solid 2px green' } }>
          <div className="container">
            <h2>{ this.props.title }</h2>
            <div className="section-content">
              { this.props.children }
              { this._renderContent() }
            </div>
          </div>
        </section>
      </Waypoint>
    );
  }
}

Section.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

export default Section;
