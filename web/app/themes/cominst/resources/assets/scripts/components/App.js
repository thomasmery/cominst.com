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
import LangSwitcher from './LangSwitcher';
import Section from './Section';
import * as ContentContainers from './content-containers';
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

  constructor (props) {
    super(props);

    this.sections = {};
    this.targetSectionPath = null;

    this.state = {
      lang: {
        code: appData.lang || 'fr',
      },
      activeSectionId: null,
      data: {
        languages: Object.keys(appData.languages).map((lang) => appData.languages[lang]),
        primary_navigation: this._transformNavigationData(appData.primary_navigation),
        posts: {
          'post': appData.posts,
        },
        pages: appData.pages,
      },
    }

    this._onEnterSection = this._onEnterSection.bind(this);
    this._onLeaveSection = this._onLeaveSection.bind(this);

    this._storeSectionRef = this._storeSectionRef.bind(this);
    this._transformNavigationData = this._transformNavigationData.bind(this);

  }

  /**
   * takes a js object of the site tree structure
   * and apply some necessaty cleanups and transforms
   * @param {object} data
   */
  _transformNavigationData (data) {

    const supported_item_types = [
      'post_type',
      'post_type_archive',
    ];

    // remove unwanted elements
    const sanitized_data = data.filter( (item ) => {
      // we do not support every WP menu item type at this time
      // only 'post_type' and 'post_type_archive' are supported
      return supported_item_types.reduce(
        (value, currentValue) => {
          return item.type === currentValue || value
        },
        false
      );
    });

    return sanitized_data.map(
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

  /**
   * an array of objects that we use to build the content
   */
  _getDataStore () {
    return [
      ...this.state.data.pages,
    ];
  }

  _buildSectionData (item) {
    const objects = this._getDataStore();
    let object = {};
    object.type = item.type;
    object.children = item.children.map(
      (child) => this._buildSectionData(child)
    );
    let contentContainer;
    switch (item.type) {
      case 'post_type':
        object = {
          ...object,
          ...objects.filter(
            (object) => object.id === item.object_id
          )[0],
        }
        // convenient access to the template type
        // also safe guard against non-existing ContentContainer Component by checking the component can be accessed
        contentContainer = ContentContainers[object.acf.content_template];
        object.content_template = contentContainer ? object.acf.content_template : 'ContentContainer01';
      break;
      case 'post_type_archive':
        object.content_template = 'ContentContainerArchive';
        object.posts = this.state.data.posts[item.object] || []
      break;

    }
    return object;
  }

  componentDidMount () {
    getClient(appData.home_url).then(
      (client) => {
        client.posts().then(
          (posts) =>
            this.setState( (state) => {
              return {
                data: {
                  ...state.data,
                  posts: {
                    ...state.data.posts,
                    'post': posts,
                  },
                },
              }
            }
          )
        )
      }
    );
  }

  _renderPosts ( post_type = 'post' ) {
    return this.state.data.posts[post_type].map( (post) => <h3 key={ post.id }>{ post.title.rendered } </h3> )
  }

  _renderSections () {
    // build sections out of main menu
    const sections = this.state.data.primary_navigation.map(
        (item) => {
          // we're extracting the object from the data store
          // meaning that we need to have the object in store
          // we'll add lazy fetching later if needed
          // but we also populate the object with its children in case the menu_item states we need them
          const data = this._buildSectionData(item);

          return data ? (
            <Section
              key={item.id}
              title={item.title}
              data={data}
              ContentContainer={ContentContainers[data.content_template]}
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
        data={ { ...appData.pages.filter((page)=> page.id == 103 || page.id == 106)[0], children: [] } }
        ContentContainer={ContentContainers['ContentContainerHome']}
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
    routes.push(<Route
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
                // this helps as we're first rendering the page and the refs to the Sections are not accessible for render
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
        <LangSwitcher languages={this.state.data.languages} activeLanguage={this.state.lang.code} />
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
