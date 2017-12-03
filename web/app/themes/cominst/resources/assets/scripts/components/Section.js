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
        />
       )
      : ContentContainer;

  }

  render () {
    return (
      <Waypoint
        onEnter={ this._onEnter }
        onLeave={ this._onLeave }
        topOffset={400}
        bottomOffset={400}
      >
        <section id={this.props.id} className={ this.props.className } style={this.props.sectionStyles}>
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
}

export default Section;
