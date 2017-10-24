/* eslint-disable no-console */
/* global appData */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import WPAPI from 'wpapi';

/**
 * Internal dependencies
 */
import Header from './Header';
import Nav from './Nav';
import Section from './Section';
import ScrollToRouteHelper from './ScrollToRouteHelper';

/** Data */
WPAPI.discover( appData.home_url )
  .then( (apiClient) => apiClient )
  .catch( (reason) => { throw new Error(`Can not discover this site's API: ${reason}`) } );

async function getClient(site_url) {
  try {
     const client = await WPAPI.discover(site_url);
     return client;
  }
  catch (error) {
    throw new Error(error);
  }
}

class App extends Component {

  constructor () {
    super();

    this.sections = {};
    this.targetSectionPath = null;

    this.state = {
      lang: {
        code: appData.lang || 'fr',
      },
      activeSectionId: null,
      data: {
        primary_navigation: this._transformNavigationData(appData.primary_navigation),
        posts: appData.posts,
        pages: appData.pages,
      },
    }

    this._onEnterSection = this._onEnterSection.bind(this);
    this._onLeaveSection = this._onLeaveSection.bind(this);

    this._storeSectionRef = this._storeSectionRef.bind(this);
    this._transformNavigationData = this._transformNavigationData.bind(this);

  }

  _transformNavigationData (data) {
    return data.map(
      (item) => {
        const matchSlugAgainstUrl = item.url.match(/([a-zA-Z0-9-]*)\/?$/);
        item.slug = matchSlugAgainstUrl[1] || '';

        const path = item.url
          .replace(appData.home_url, '')
          .replace(/^[/]+|[/]+$/g, '');
        item.path = `/${appData.lang}/${path}`;

        // level up with other api responses for other objects
        // where id is lowercase
        item.id = item.ID;
        delete item.ID;

        return item;
      }
    );
  }

  componentDidMount () {
    getClient(appData.home_url).then(
      (client) => {
        client.posts().then(
          (posts) =>
            this.setState( (state) => {
              return { data: { ...state.data, posts } }
            }
          )
        )
      }
    );
  }

  _renderPosts () {
    return this.state.data.posts.map((post) => <h3 key={ post.id }>{ post.title.rendered } </h3>)
  }

  _renderSections () {
    const objects = [
      ...this.state.data.pages,
    ];
    const sections = this.state.data.primary_navigation.map(
        (item) => {
          let object;
          switch(item.type) {
            case 'post_type':
              object = objects.filter(
                (object) => object.id === item.object_id
              )[0];
              break;
            case 'taxonomy':
              object = item;
              break;
          }
          return object ? (
            <Section
              key={item.id}
              title={item.title}
              id={item.slug}
              path={item.path}
              ref={this._storeSectionRef}
              onEnter={ this._onEnterSection }
              onLeave={ this._onLeaveSection }>
              </Section>
            ) : '';
          }
        );

    // add Home
    sections.unshift(
      <Section
        key="0"
        title="Home"
        id="home"
        path={ `/${this.state.lang.code}` }
        ref={this._storeSectionRef}
        onEnter={ this._onEnterSection }
        onLeave={ this._onLeaveSection }>
      </Section>
    );

    return sections;
  }

  _renderRoutes () {

    const routes = [];

    // a route for Home
    routes.unshift(<Route
      key="0"
      path={ `/${this.state.lang.code}` }
      exact
      render={ (route_props) => {
          if (this.sections.home && ! this.enteringSection) {
            return <ScrollToRouteHelper targetComponent={this.sections.home} { ...route_props } />
          }
          else {
            return null;
          }
        }
      }
    />)

    // a route for each main menu item
    routes.push(
      this.state.data.primary_navigation.map(
        (item) => (
          <Route
            key={item.id}
            path={ item.path }
            exact
            render={ (route_props) => {
                //  here we need to check if the ref to the section has been stored so it can be used
                // this helps as we're first rendering the page and the refs to the Sections are not accessible n fort render
                //  we are also checking if we are not manually scrolling into a section
                // if we are we will unmount the ScrollToRouteHelper component as soon as we enter another section
                //  i.e. setState is called in _onEnterSection and thus the route is re-rendered but this time ... enteringSection is true
                // this will allow ScrollToRouteHelper to be mounted again next time we trigger the route
                // and thus trigger a scroll to the Section
                // this is necessary because the scroll is triggered on ScrollToRouteHelper componentDidMount
                // note: scroll could be triggered on componentDidUpdate ... this has to be explored
                if (this.sections[item.slug] && ! this.enteringSection) {
                  return <ScrollToRouteHelper targetComponent={this.sections[item.slug]} { ...route_props } />
                }
                else {
                  return null;
                }
              }
            }
          />
        )
      )
    );

    return routes;
  }

  _onEnterSection (section) {
    // we need to flag the fact that we're 'scrolling' into the section
    // main reason is to be able to unmount the ScrollToRouteHelper as we scroll into a section - @see _renderRoutes()
    this.enteringSection = true;

    // we also want to track which section is active - for Nav items highlighting mainly
    this.setState(
      { activeSectionId: section.props.id },
      () => {
        // we're done entering - we need to 're-activate' the routing mechanism for nav links
        this.enteringSection = false;
      }
    );
  }

  _onLeaveSection () {
  }

  _storeSectionRef (element) {
    if(!element) {
      return;
    }
    this.sections[element.props.id] = element;
  }

  render() {

    return <div>

      <Header
        title="Communication & Institutions"
        homeUrl={`/${this.state.lang.code}`}
        ref={
          (element) => {
            if(!element) {
              return;
            }
            this.headerRef = element;
          }
        }
      >
        <Nav data={this.state.data.primary_navigation} activeSectionId={this.state.activeSectionId} />
      </Header>

      { this._renderSections() }

      { this._renderRoutes() }

    </div>

  }

}

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(App);
