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
        post_types: {
          'post': {
            ...appData.post_types.post,
            posts: appData.posts.data,
            paging: appData.posts.paging,
          },
        },
        taxonomies: this._transformTaxonomyData(appData.taxonomies),
        pages: appData.pages,
        isFetching: {},
      },
    }

    // we need to be able to access post_types taxonomies easily
    this.state.data.post_types_taxonomies =  this._buildPostTypesTaxonomies();

    this._onEnterSection = this._onEnterSection.bind(this);
    this._onLeaveSection = this._onLeaveSection.bind(this);

    this._storeSectionRef = this._storeSectionRef.bind(this);
    this._transformNavigationData = this._transformNavigationData.bind(this);
    this._buildPostTypesTaxonomies = this._buildPostTypesTaxonomies.bind(this);

    this._getClient = this._getClient.bind(this);
    this._getPosts = this._getPosts.bind(this);
    this._updatePosts = this._updatePosts.bind(this);

  }

  /**
   * Lifecycle
   */

  componentDidMount () {
    this._updatePosts(this.props.location.pathname);
  }

  componentWillReceiveProps (nextProps) {
    // we do not want to proceed if requesting same route
    if(nextProps.location.pathname === this.props.location.pathname) {
      return;
    }

    // update posts - reacting to route change to a taxonomy archive route
    this._updatePosts(nextProps.location.pathname);
  }

  /** Fetching Data */

  _getClient () {
    const _this = this;
    if( this._client ) {
      return Promise.resolve(this._client);
    }
    else {
      return getClient(appData.home_url).then(
        (client) => {
          _this._client = client;
          return client;
        }
      );
    }
  }

  _getPosts ( params = [] ) {

    if(this.state.data.isFetching.post) {
      return;
    }

    const categories = [];
    if(params.filter( (param) => param.name === 'categories' ).length) {
      const category_id = params.filter( (param) => param.name === 'categories' )[0].value;
      const category = this.state.data.taxonomies.category.terms.filter( (term) => term.id === category_id)[0];
      categories.push(category)
    }

    this.setState(
      (state) => ({ data: {
          ...state.data,
          isFetching: {
            ...state.data.isFetching,
            post: true,
          },
          post_types: {
            ...state.data.post_types,
            'post': {
              ...state.data.post_types.post,
              categories,
            },
          },
        },
      })
    );

    this._getClient().then(
      (client) => {
        const posts_request = client.posts();
        posts_request.param( 'per_page', 3 );
        params.forEach(
          (param) => posts_request.param( param.name, param.value )
        );
        posts_request.then(
          (posts) => {
            const paging = {
              ...posts._paging,
              currentPage: params.filter( (param) => param.name === 'page' ).length ?
                params.filter( (param) => param.name === 'page' )[0].value : 1,
            };

            this.setState(
              (state) => ({ data: {
                  ...state.data,
                  isFetching: {
                    ...state.data.isFetching,
                    post: false,
                  },
                  post_types: {
                    ...state.data.post_types,
                    'post': {
                      ...state.data.post_types.post,
                      paging,
                      posts,
                    },
                  },
                },
              })
            );
          }
        ).catch(function( err ) {
            console.log(err);
        });
      }
    );
  }

  /**
   * triggers fetching posts for taxonomy terms archive based on a path
   *
   * simulates Routes
   * we want to fetch new posts as the route changes to a taxonomy terms archive route
   * we can not use <Route /> as we're not rendering a component that will fetch its data
   * and we want to keep the data fetching in <App />
   * and pass the newly received posts to the already rendered posts container
   *
   * as each 'term' has a 'path' property (added by us) we can detect for which path we need the data
  */
  _updatePosts (path) {

    const params = [];

    // extract pagination parameters
    const pagination_params_matches = path.match(/(page)\/([0-9]+)/);
    if(pagination_params_matches && pagination_params_matches.length === 3) {
      params.push( {
        name: pagination_params_matches[1],
        value: pagination_params_matches[2],
      } );
    }

    // will trigger a fetch for all posts when path is (or contains) the post post_type_archive path
    this.state.data.primary_navigation.map(
      (item) => {
        if(
          item.type === 'post_type_archive' &&
          item.object === 'post' &&
          path.replace(/\/?$/, '').match(item.path.replace(/\/?$/, '/all'))
        ) {

            this._getPosts( params );
          }
      }
    );

    //
    Object.keys(this.state.data.taxonomies).forEach(
      (taxonomy) => {
        this.state.data.taxonomies[taxonomy].terms.forEach(
          (term) => {
            // only fetch if route is term archive path
            if( path.replace(/\/?$/, '').match(term.path.replace(/\/?$/, ''))) {
              // get posts for the taxonomy term
              params.push( { name: this.state.data.taxonomies[taxonomy].rest_base, value: term.id } );
              this._getPosts( params );
              return;
            }
          }
        )
      }
    )
  }


  /** Data manipulation */

  /**
   * takes a js object of the site tree structure
   * and apply some necessary cleanups and transforms
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
   * takes a js object of taxonomy objects
   * and add & transform for the site's need
   * for instance: add server fetched taxonomy terms to a 'terms' property
   * @param {object} data
   */
  _transformTaxonomyData (data) {
    return Object.keys(data)
      .reduce(
        (object, slug) => {
          object[slug] = {};
          switch(slug) {
            case 'category':
              object[slug].terms = this._transformTaxonomyTermsData(appData.categories);
              break;
            default:
            object[slug].terms = []
          }
          object[slug] = { ...object[slug], ...data[slug] };
          return object;
        },
        {}
    );
  }

  /**
   * takes a js object of taxonomy terms
   * and add & transform for the site's need
   * @param {object} data
   */
  _transformTaxonomyTermsData (data) {
    return data.map(
      (term) => {
        // we need to add a 'path' property to the term
        // to be used with our client side router
        const path = term.link
          .replace(appData.home_url, '')
          .replace(/^[/]+|[/]+$/g, '');
        term.path = `/${appData.lang}/${path}`;
        return term;
      }
    );
  }

  _buildPostTypesTaxonomies () {
    return Object.keys(this.state.data.post_types).reduce(
      (post_types_taxonomies, post_type) => {
        post_types_taxonomies[post_type] =
          Object.keys(this.state.data.taxonomies).reduce(
              (post_type_taxonomies, taxonomy_slug) => {
                const post_type_exists_for_taxonomy =
                  this.state.data.taxonomies[taxonomy_slug].types.filter((type) => type === post_type).length;
                if(post_type_exists_for_taxonomy) {
                  post_type_taxonomies[taxonomy_slug] = this.state.data.taxonomies[taxonomy_slug];
                }
                return post_type_taxonomies;
              },
              {}
            )
        return post_types_taxonomies;
      },
      {}
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

  /**
   * build a data object from a tree structure item
   * adding or tranforming properties as needed
   * this object will be passed to a Section component as its data
   * note: at this time the tree structure is derived from the WP Menu Tree
   * we only support 2 item type: post_type, post_type_archive
   * @param {object} item
   */
  _buildSectionData (item) {
    // the data store
    const objects = this._getDataStore();
    let object = {};
    object.type = item.type;
    // recursively add children
    object.children = item.children.map(
      (child) => this._buildSectionData(child)
    );
    let contentContainer;
    switch (item.type) {
      //page, post ...
      case 'post_type':
        object = {
          // the foundation for the object as setup above
          ...object,
          // extract the main data from the data store
          // item.object_id should be the WP element ID that the WP Menu Item represents
          ...objects.filter(
            (object) => object.id === item.object_id
          )[0],
        }
        // convenient access to the template type
        // also safe guard against non-existing ContentContainer Component by checking the component can be accessed
        contentContainer = ContentContainers[object.acf.content_template];
        object.content_template = contentContainer ? object.acf.content_template : 'ContentContainer01';

        object.isFetching = this.state.data.isFetching[object.slug] || false;
      break;
      // posts archive
      case 'post_type_archive':
        object.content_template = 'ContentContainerArchive';
        object.posts = this.state.data.post_types[item.object].posts || []
        // choose which taxonomy filters/menu we make available to the component
        switch(item.object) {
          case 'post':
            // hard coded taxonomies terms for posts - extracted from our data store
            // at this time we only need to display a categories menu and do not deal with other taxonomies (like 'post_tag' for instance)
            object.taxonomies = { categories: this.state.data.post_types_taxonomies.post.category || { terms: [] } }
            object.post_type = this.state.data.post_types[item.object];
            object.post_type_archive_path = `${item.path}/all`;
            break;
          default:
            object.taxonomies = {}
        }
        // fetching flag - using the psot_type key - i.e. 'post'
        object.isFetching = this.state.data.isFetching[item.object] || false;
      break;

    }
    return object;
  }

  /**
   * Rendering
   */

  _renderPosts ( post_type = 'post' ) {
    return this.state.data.posts[post_type].map(
      (post) => <h3 key={ post.id }>{ post.title.rendered }</h3>
    )
  }

  _renderSections () {
    // build sections out of main menu
    const sections = this.state.data.primary_navigation.map(
        (item) => {
          // we're extracting the object from the data store
          // meaning that we need to have the object in store
          // we'll add lazy fetching later if needed
          const data = this._buildSectionData(item);
          return data ? (
            <Section
              key={item.id}
              title={item.title}
              data={data}
              ContentContainer={ContentContainers[data.content_template]}
              isFetching={data.isFetching}
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

  /** Navigation */

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
                  return <ScrollToRouteHelper ease="in-out-quad" duration={500} targetComponent={this.sections[item.slug]} { ...route_props } />
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
