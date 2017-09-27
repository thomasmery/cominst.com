import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Waypoint from 'react-waypoint';

class Section extends PureComponent {

  constructor (props) {
    super();

    this._onEnter = props.onEnter ? props.onEnter.bind(null, this) : () => {};
    this._onLeave = props.onLeave ? props.onLeave.bind(null, this) : () => {};

  }

  render () {
    return (
      <Waypoint
        onEnter={ this._onEnter }
        onLeave={ this._onLeave }
        topOffset={100}
        bottomOffset="80%"
      >
        <section id={this.props.id} style={ { minHeight: 400, border: 'solid 2px green' } }>
          <div className="container">
            <h2>{ this.props.title }</h2>
            <div className="section-content">
              { this.props.children }
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
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

export default Section;
