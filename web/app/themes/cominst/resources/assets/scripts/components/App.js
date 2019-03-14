/* eslint-disable no-console */
/* global appData */

/**
 * External dependencies
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Switch, Route, Link } from "react-router-dom";
import WPAPI from "wpapi";
import classNames from "classnames";
// import _ from 'lodash';

import ImagePreloader from "image-preloader";

import ReactGA from "react-ga";

/**
 * Internal dependencies
 */
import Header from "./Header";
import Nav from "./Nav";
import LangSwitcher from "./LangSwitcher";
import Section from "./Section";
import * as ContentContainers from "./content-containers";
import ScrollToRouteHelper from "./ScrollToRouteHelper";

/** Data */
WPAPI.discover(appData.home_url)
  .then(apiClient => apiClient)
  .catch(reason => {
    throw new Error(`Can not discover this site's API: ${reason}`);
  });

async function getClient(site_url) {
  try {
    const client = await WPAPI.discover(site_url);
    return client;
  } catch (error) {
    throw new Error(error);
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.sections = {};
    this.targetSectionPath = null;

    this.allowScroll = true;

    this.state = {
      windowHeight: window.innerHeight,
      headerIsCollapsed: false,
      mobileMenuIsHidden: true,
      lang: {
        code: appData.lang || "fr",
      },
      activeSectionId: null,
      activePostSlug: null,
      postsListPath: "",
      data: {
        site_name: appData.site_name,
        site_description: appData.site_description,
        languages: Object.keys(appData.languages).map(
          lang => appData.languages[lang]
        ),
        primary_navigation: this._prepareNavigationData(
          appData.primary_navigation
        ),
        secondary_navigation: appData.secondary_navigation,
        post_types: {
          post: {
            ...appData.post_types.post,
            posts: appData.posts.data,
            paging: appData.posts.paging,
            category_id: appData.posts.category_id,
          },
        },
        taxonomies: this._prepareTaxonomyData(appData.taxonomies),
        pages: this._preparePagesData(appData.pages),
        references_by_sectors: appData.references_by_sectors,
        theme_options: appData.theme_options.acf,
        isFetching: {},
      },
    };

    // we need to be able to access post_types taxonomies easily
    this.state.data.post_types_taxonomies = this._buildPostTypesTaxonomies();

    // we want to account for a possible default categories for posts
    this.state.data.post_types.post.categories = appData.posts.category_id
      ? [this._getCategoryTermById(appData.posts.category_id)]
      : [];

    this._onEnterSection = this._onEnterSection.bind(this);
    this._onLeaveSection = this._onLeaveSection.bind(this);

    this._storeSectionRef = this._storeSectionRef.bind(this);
    this._prepareNavigationData = this._prepareNavigationData.bind(this);
    this._buildPostTypesTaxonomies = this._buildPostTypesTaxonomies.bind(this);

    this._getClient = this._getClient.bind(this);
    this._getPosts = this._getPosts.bind(this);
    this._updatePosts = this._updatePosts.bind(this);

    this._onMobileMenuItemClickHandler = this._onMobileMenuItemClickHandler.bind(
      this
    );
    this._onMobileMenuButtonOpenClickHandler = this._onMobileMenuButtonOpenClickHandler.bind(
      this
    );
    this._onMobileMenuButtonCloseClickHandler = this._onMobileMenuButtonCloseClickHandler.bind(
      this
    );
  }

  /**
   * compute header height
   * will be passed to scroll helper & sections
   */
  _getHeaderHeight() {
    const header = document.querySelector("#app header");
    const headerChild = header.children[0];
    const navContainer = document.querySelector("#app header .nav-container");
    const colLeft = document.querySelector("#app header .col-left");
    const leftBrandLogo = document.querySelector(
      "#app header .text-left .brand-logo"
    );
    const headerPaddingTop = parseInt(getComputedStyle(header).paddingTop);
    const headerPaddingBottom = parseInt(
      getComputedStyle(header).paddingBottom
    );
    const navContainerHeight =
      navContainer.offsetHeight +
      parseInt(getComputedStyle(navContainer).marginTop);
    const leftBrandLogoHeight = leftBrandLogo.offsetHeight;
    let collapsedBaseHeight =
      leftBrandLogoHeight > navContainerHeight
        ? leftBrandLogoHeight + 10
        : navContainerHeight;
    if (window.matchMedia("(max-width: 575px)").matches) {
      collapsedBaseHeight = colLeft.offsetHeight;
    }
    const headerHeight =
      (this.state.headerIsCollapsed
        ? collapsedBaseHeight
        : headerChild.clientHeight - 10) +
      headerPaddingTop +
      headerPaddingBottom;
    return header && headerHeight;
  }

  // compute header height in its collapsed state
  // relying on what we know it will be comprise of in this state
  // this is not ideal since we're relying on knowing how the .collapsed class will affect the header layout
  // it woud probaby be better to stay in react all the time and set inline styles etc.
  _getCollaspsedHeaderHeight() {
    const header = document.querySelector("#app header");
    const navContainer = document.querySelector("#app header .nav-container");
    const colLeft = document.querySelector("#app header .col-left");
    const leftBrandLogo = document.querySelector(
      "#app header .col-left .brand-logo"
    );
    const headerPaddingTop = 6;
    const headerPaddingBottom = 16;
    const navContainerHeight =
      navContainer.offsetHeight +
      parseInt(getComputedStyle(navContainer).marginTop);
    const leftBrandLogoHeight = leftBrandLogo.offsetHeight;
    let collapsedBaseHeight =
      leftBrandLogoHeight > navContainerHeight
        ? leftBrandLogoHeight + 10
        : navContainerHeight;
    if (window.matchMedia("(max-width: 575px)").matches) {
      collapsedBaseHeight = colLeft.offsetHeight;
    }
    const headerHeight =
      collapsedBaseHeight + headerPaddingTop + headerPaddingBottom;
    return header && headerHeight;
  }

  /**
   * Lifecycle
   */

  componentDidMount() {
    // we need to detect when images in the header are actually loaded
    // because we will then get an accurate height value
    const preloader = new ImagePreloader();
    const images = document.querySelectorAll("#app header img");
    const _component = this;
    preloader.preload.apply(this, images).then(() => {
      _component.setState({
        headerHeight: _component._getHeaderHeight(),
        windowHeight: window.innerHeight,
      });
    });

    this._updatePosts(this.props.location.pathname);

    /** Google analytics */
    ReactGA.initialize(appData.analytics_ID);

    // phone call tracking
    window.google_replace_number = this.state.data.theme_options.phone_number; // eslint-disable-line
    (function(a, e, c, f, g, h, b, d) {
      var k = { ak: "866831806", cl: "nycJCLDJx20QvpurnQM" };
      a[c] =
        a[c] ||
        function() {
          (a[c].q = a[c].q || []).push(arguments);
        };
      a[g] || (a[g] = k.ak);
      b = e.createElement(h);
      b.async = 1;
      b.src = "//www.gstatic.com/wcm/loader.js";
      d = e.getElementsByTagName(h)[0];
      d.parentNode.insertBefore(b, d);
      a[f] = function(b, d, e) {
        a[c](2, b, k, d, null, new Date(), e);
      };
      a[f]();
    })(window, document, "_googWcmImpl", "_googWcmGet", "_googWcmAk", "script");
  }

  componentWillReceiveProps(nextProps) {
    // we do not want to proceed if requesting same route
    if (nextProps.location.pathname === this.props.location.pathname) {
      return;
    }

    this.windowHeight = window.innerHeight;

    // update posts - reacting to route change to a taxonomy archive route
    this._updatePosts(nextProps.location.pathname);
  }

  componentDidUpdate(prevProps, prevState) {
    // updating headerHeight as the DOM header element has updated its styles
    // after we set the headerIsCollapsed App state property
    const headerHeight = this._getHeaderHeight();
    if (prevState.headerHeight !== headerHeight) {
      this.setState({ headerHeight });
    }
  }

  /** Fetching Data */

  _getClient() {
    const _this = this;
    if (this._client) {
      return Promise.resolve(this._client);
    } else {
      return getClient(appData.home_url).then(client => {
        _this._client = client;
        return client;
      });
    }
  }

  /**
   *
   * @param {object} params an object to configure the get posts request
   */
  _getPosts(params = []) {
    if (this.state.data.isFetching.post) {
      return;
    }

    // extract 'categories' from params
    const categories = [];
    if (params.filter(param => param.name === "categories").length) {
      const category_id = params.filter(param => param.name === "categories")[0]
        .value;
      const category = this._getCategoryTermById(category_id);
      categories.push(category);
    }

    // notify we are fetching data
    this.setState(state => ({
      data: {
        ...state.data,
        isFetching: {
          ...state.data.isFetching,
          post: true,
        },
        post_types: {
          ...state.data.post_types,
          post: {
            ...state.data.post_types.post,
            categories,
          },
        },
      },
    }));

    this._getClient().then(client => {
      const posts_request = client.posts();
      // pagination
      posts_request.param("per_page", appData.posts_per_page);
      // add other params to request
      params.forEach(param => posts_request.param(param.name, param.value));
      // request
      posts_request
        .then(
          // now we have our posts
          posts => {
            // paging
            const paging = {
              ...posts._paging,
              currentPage: params.filter(param => param.name === "page").length
                ? params.filter(param => param.name === "page")[0].value
                : 1,
            };

            this.setState(state => ({
              ...state,
              // we might have been requesting a single post but had to jump to its page to display it
              activePostSlug: null || state.nextActivePostSlug,
              nextActivePostSlug: null,
              data: {
                ...state.data,
                // fetching has finished
                isFetching: {
                  ...state.data.isFetching,
                  post: false,
                },
                // set posts data
                post_types: {
                  ...state.data.post_types,
                  post: {
                    ...state.data.post_types.post,
                    paging,
                    posts,
                  },
                },
              },
            }));
          }
        )
        .catch(function(err) {
          console.log(err);
        });
    });
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
  _updatePosts(path) {
    let params = [];
    let match = false;

    // extract pagination parameters
    const pagination_params_matches = path.match(/(page)\/([0-9]+)/);
    if (pagination_params_matches && pagination_params_matches.length === 3) {
      params.push({
        name: pagination_params_matches[1],
        value: pagination_params_matches[2],
      });
    }

    // will trigger a fetch for all posts when path is (or contains) the post post_type_archive path
    this.state.data.primary_navigation.forEach(item => {
      if (
        item.type === "post_type_archive" &&
        item.object === "post" &&
        path.replace(/\/?$/, "").match(item.path.replace(/\/?$/, "/all"))
      ) {
        if (this.state.postsListPath !== path) {
          // ReactGA.pageview(window.location.pathname + window.location.search);
          this._getPosts(params);
          // set last posts list url visited
          this.setState(state => ({
            ...state,
            postsListPath: path,
          }));
        } else {
          this.setState(state => ({
            ...state,
            activePostSlug: null,
          }));
        }
        match = true;
      }
    });

    if (match) {
      return;
    }

    // try to match a taxonomy term path
    // or a single post - a post's path contains the category as we set the permalink structure to /%category%/%postname%/
    Object.keys(this.state.data.taxonomies).forEach(taxonomy => {
      this.state.data.taxonomies[taxonomy].terms.forEach(term => {
        // only fetch if route is term archive path - an exact match between term path and requested route
        // must also check for /page/n paths
        const regExpPaginated = new RegExp(
          term.path.replace(/\/?$/, "(/page/[0-9]+)")
        );
        if (
          path.replace(/\/?$/, "") === term.path.replace(/\/?$/, "") ||
          path.replace(/\/?$/, "").match(regExpPaginated)
        ) {
          // do not reload if we're getting the same page
          // note: we use those posts list path as what they are but also to 'clear' a single post path
          // to be able to re-trigger the mechanism that makes a post active - since it is triggered by a route
          // and won't be re-triggered if the route does not change
          if (this.state.postsListPath !== path) {
            ReactGA.pageview(window.location.pathname + window.location.search);
            // get posts for the taxonomy term
            params.push({
              name: this.state.data.taxonomies[taxonomy].rest_base,
              value: term.id,
            });
            this._getPosts(params);
            // set last posts list url visited
            this.setState(state => ({
              ...state,
              postsListPath: path,
            }));
          }
          // we need to reset the active post so that we can make it active again
          // as the 'set active mechanism' in the Post component checks whether its active state has changed before triggering the mechanism
          else {
            this.setState(state => ({
              ...state,
              activePostSlug: null,
            }));
          }
          return;
        }

        // should match a single post permalink (path)
        // the regexp try to take some special characters like accents and punctuation by using unicode ranges
        const characters_range =
          "a-zA-Z0-9\u00C0-\u017F\u2000-\u206F\u00A0-\u00FF-";
        const regExpSinglePost = new RegExp(
          term.path.replace(/\/?$/, `/([${characters_range}]+)`)
        );
        const isSingle = path.replace(/\/?$/, "").match(regExpSinglePost);
        if (isSingle) {
          ReactGA.pageview(window.location.pathname + window.location.search);

          // does the post exists in our store?

          // WP REST API associates a URI encoded slug to posts - we need to match that
          // thus the transformations on the original matched string
          const post_slug = encodeURI(isSingle[1]).toLocaleLowerCase();
          const post_exists_in_store = !!this.state.data.post_types.post.posts.filter(
            post => post.slug === post_slug
          ).length;

          // when a requested single post has not been loaded
          // we look for its page in the 'all posts' list that contains posts' { id, post_name }
          if (!post_exists_in_store) {
            const posts = appData.all_posts_ids_and_slugs;
            // extract the index
            const post = posts
              .map((post, index) => ({ ...post, index }))
              .filter(post => post.post_name === post_slug);
            const post_index = post.length && post[0].index;
            if (!post_index) {
              return;
            }
            // find the page
            const page = Math.ceil((post_index + 1) / appData.posts_per_page);
            params = [];
            params.push({
              name: "page",
              value: page,
            });
            this._getPosts(params);
            this.setState(state => ({
              ...state,
              nextActivePostSlug: post[0].post_name,
              postsListPath: "/fr/actualites",
            }));
            return;
          }

          // set active Post
          this.setState(state => ({
            ...state,
            postsListPath: term.path,
            activePostSlug: post_slug,
          }));
          return;
        }
      });
    });
  }

  /** Data retrieval and manipulation */

  /**
   * _getCategoryTermById
   */
  _getCategoryTermById(category_id) {
    return this.state.data.taxonomies.category.terms.filter(
      term => term.id === category_id
    )[0];
  }

  /**
   * takes a js object of the site tree structure
   * and apply some necessary cleanups and transforms
   * @param {object} data
   */
  _prepareNavigationData(data) {
    const supported_item_types = ["post_type", "post_type_archive", "custom"];

    // remove unwanted elements
    const sanitized_data = data.filter(item => {
      // we do not support every WP menu item type at this time
      // only 'post_type' and 'post_type_archive' are supported
      return supported_item_types.reduce((value, currentValue) => {
        return item.type === currentValue || value;
      }, false);
    });

    return sanitized_data.map(item => {
      const matchSlugAgainstUrl = item.url.match(/([a-zA-Z0-9-]*)\/?$/);
      item.slug = matchSlugAgainstUrl[1] || "";

      const path = item.url
        .replace(appData.home_url, "")
        .replace(/^[/]+|[/]+$/g, "");
      item.path = `/${appData.lang}/${path}`;

      // level up with other api responses for other objects
      // where id is lowercase
      item.id = item.ID;
      delete item.ID;

      return item;
    });
  }

  /**
   * prepare pages data by adding or transforming data so that we can use it in the client app
   * for instance: split page content to make an 'introduction' available
   * @param {array} pages
   */
  _preparePagesData(pages) {
    return pages.map(page => {
      // split content using the <!--more--> html comment that a WP user can insert into a post content
      page.content_parts = page.content.rendered.split("<!--more-->");
      page.content_parts = page.content_parts.map(part =>
        part.replace(/^<\/(.*)>/, "").replace(/^<(.*)>$/, "")
      );
      page.introduction = page.content_parts.concat().splice(0, 1)[0];
      page.body =
        page.content_parts.length > 1
          ? page.content_parts
              .concat()
              .splice(1)
              .join("")
          : "";

      // acf stuff
      page.subtitle = page.acf.subtitle;

      return page;
    });
  }

  /**
   * takes a js object of taxonomy objects
   * and add & transform for the site's need
   * for instance: add server side obtained taxonomy terms to a 'terms' property
   * @param {object} data
   */
  _prepareTaxonomyData(data) {
    return Object.keys(data).reduce((object, slug) => {
      object[slug] = {};
      switch (slug) {
        case "category":
          object[slug].terms = this._prepareTaxonomyTermsData(
            appData.categories
          );
          break;
        default:
          object[slug].terms = [];
      }
      object[slug] = { ...object[slug], ...data[slug] };
      return object;
    }, {});
  }

  /**
   * takes a js object of taxonomy terms
   * and add & transform for the site's need
   * @param {object} data
   */
  _prepareTaxonomyTermsData(data) {
    return data.map(term => {
      // we need to add a 'path' property to the term
      // to be used with our client side router
      const path = term.link
        .replace(appData.home_url, "")
        .replace(/^[/]+|[/]+$/g, "");
      term.path = `/${appData.lang}/${path}`;
      return term;
    });
  }

  _buildPostTypesTaxonomies() {
    return Object.keys(this.state.data.post_types).reduce(
      (post_types_taxonomies, post_type) => {
        post_types_taxonomies[post_type] = Object.keys(
          this.state.data.taxonomies
        ).reduce((post_type_taxonomies, taxonomy_slug) => {
          const post_type_exists_for_taxonomy = this.state.data.taxonomies[
            taxonomy_slug
          ].types.filter(type => type === post_type).length;
          if (post_type_exists_for_taxonomy) {
            post_type_taxonomies[taxonomy_slug] = this.state.data.taxonomies[
              taxonomy_slug
            ];
          }
          return post_type_taxonomies;
        }, {});
        return post_types_taxonomies;
      },
      {}
    );
  }

  /**
   * we're receiving a list of 'sectors' with a 'references' key
   * the sectors are taxonomy terms and the references are custom post types
   * we get hold of them via regular WP queries
   * we need to format the items so that they can feed the ListAndModal Content Container
   * which is a generic content container for lists that expect 'items' and 'sub_items'
   * @param {array} items
   */
  _prepareReferencesBySectors(items) {
    return items.map(item => {
      item.id = item.term_id;
      item.title = item.name;
      item.sub_items = item.references.map(sub_item => {
        sub_item.id = sub_item.ID;
        sub_item.title = sub_item.post_title;
        return sub_item;
      });
      return item;
    });
  }

  /**
   * an array of objects that we use to build the content
   */
  _getDataStore() {
    return [...this.state.data.pages];
  }

  /**
   * build a data object from a tree structure item
   * adding or tranforming properties as needed
   * this object will be passed to a Section component as its data
   * note: at this time the tree structure is derived from the WP Menu Tree
   * we only support 2 item type: post_type, post_type_archive
   * @param {object} item
   */
  _buildSectionData(item) {
    // the data store
    const objects = this._getDataStore();
    let object = {};
    object.type = item.type;
    // recursively add children
    object.children = item.children.map(child => this._buildSectionData(child));
    let contentContainer;
    switch (item.type) {
      //page, post ...
      case "post_type":
        object = {
          // the foundation for the object as setup above
          ...object,
          // extract the main data from the data store
          // item.object_id should be the WP element ID that the WP Menu Item represents
          ...objects.filter(object => object.id === item.object_id)[0],
        };
        // convenient access to the template type
        // also safe guard against non-existing ContentContainer Component by checking the component can be accessed
        contentContainer = ContentContainers[object.acf.content_template];
        object.content_template = contentContainer
          ? object.acf.content_template
          : "ContentContainerPagesAndSidebarNavigation";
        object.color_theme = object.acf.color_theme;

        switch (object.content_template) {
          case "ContentContainerListAndModal":
            object.items = this._prepareReferencesBySectors(
              this.state.data.references_by_sectors
            );
            break;
          case "ContentContainerFooter":
            object = {
              ...object,
              color_theme: "dark",
              site_name: this.state.data.site_name,
              site_description: this.state.data.site_description,
              ...this.state.data.theme_options,
              contact_details: object.content.rendered,
              secondary_navigation: {
                title: this.state.data.secondary_navigation
                  ? this.state.data.secondary_navigation.title
                  : "",
                items: this.state.data.secondary_navigation
                  ? this.state.data.secondary_navigation.items
                  : [],
              },
            };
            object.content_template = "ContentContainerFooter";
            object.shouldCloseContactFormModal =
              this.state.activeSectionId !== "contact";
            break;
        }
        object.isFetching = this.state.data.isFetching[object.slug] || false;
        break;
      // posts archive
      case "post_type_archive":
        object.content_template = "ContentContainerArchive";
        object.posts = this.state.data.post_types[item.object].posts || [];
        // choose which taxonomy filters/menu we make available to the component
        switch (item.object) {
          case "post": {
            const blog_page_data = {
              ...this.state.data.pages.filter(
                page => page.id == appData.blog_page_id
              )[0],
              children: [],
            };
            // hard coded taxonomies terms for posts - extracted from our data store
            // at this time we only need to display a categories menu and do not deal with other taxonomies (like 'post_tag' for instance)
            object.taxonomies = {
              categories: this.state.data.post_types_taxonomies.post
                .category || { terms: [] },
            };
            object.post_type = this.state.data.post_types[item.object];
            object.post_type_archive_path = `${item.path}/all`;
            object.active_post_slug = this.state.activePostSlug;
            object.posts_list_path = this.state.postsListPath;
            object.title = blog_page_data.title;
            object.subtitle = blog_page_data.subtitle;
            object.posts_per_page = appData.posts_per_page;
            break;
          }
          default:
            object.taxonomies = {};
        }
        // fetching flag - using the psot_type key - i.e. 'post'
        object.isFetching = this.state.data.isFetching[item.object] || false;
        break;
      case "custom":
        switch (item.url) {
          case "/contact":
            object = {
              ...object,
              color_theme: "dark",
              site_name: this.state.data.site_name,
              site_description: this.state.data.site_description,
              ...this.state.data.theme_options,
            };
            object.content_template = "ContentContainerFooter";
            break;
        }
        break;
    }
    return object;
  }

  /**
   * Rendering
   */

  _renderHeader() {
    return (
      <Header
        title="Communication & Institutions"
        homeUrl={`/${this.state.lang.code}`}
        className={classNames({
          collapsed: this.state.headerIsCollapsed,
          "mobile-menu-hidden": this.state.mobileMenuIsHidden,
        })}
        style={{ height: this.state.headerHeight }}
      >
        <div className="row">
          <div className="col-sm-1 col-left text-left">
            <Link to={`/${this.state.lang.code}`} className="brand-logo">
              <img src={`${appData.ui.brand_logo}`} />
            </Link>
            <h3 className="site-description">{appData.site_description}</h3>
          </div>
          <div className="col-sm-10 col-center text-center">
            <div
              className="mobile-menu-button mobile-menu-button-close"
              onClick={this._onMobileMenuButtonCloseClickHandler}
            >
              <i className="fa fa-close" aria-hidden="true" />
            </div>
            <Link to={`/${this.state.lang.code}`} className="brand-logo">
              <img src={`${appData.ui.brand_logo}`} />
            </Link>
            <div className="nav-container">
              <Nav
                data={this.state.data.primary_navigation}
                activeSectionId={this.state.activeSectionId}
                onItemClickHandler={this._onMobileMenuItemClickHandler}
              />
            </div>
            <div className="d-sm-none lang-switcher-container">
              <LangSwitcher
                languages={this.state.data.languages}
                activeLanguage={this.state.lang.code}
              />
            </div>
          </div>
          <div className="col-sm-1 col-right text-right">
            <LangSwitcher
              languages={this.state.data.languages}
              activeLanguage={this.state.lang.code}
            />
            <div
              className="mobile-menu-button mobile-menu-button-open"
              onClick={this._onMobileMenuButtonOpenClickHandler}
            >
              <i className="fa fa-bars" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Header>
    );
  }

  _renderHome() {
    const home_page_data = {
      ...appData.pages.filter(page => page.id == appData.home_page_id)[0],
      children: [],
    };

    const contentContainerHome = React.createElement(
      ContentContainers["ContentContainerHome"],
      {
        data: home_page_data,
        scrollHintElement: (
          <Link to={this.state.data.primary_navigation[0].path}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="17"
              viewBox="0 0 29 17"
            >
              <path
                fill="none"
                stroke="#018EC0"
                strokeWidth="2"
                d="M19.7005615,19.3045654 C19.7005615,19.3045654 15.4009196,15.1267497 6.80163574,6.77111816 L19.3790283,-6.20349121"
                transform="rotate(-90 14.751 7.05)"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        ),
      }
    );

    // choose appropriate background image size depending on device screen
    let homeBackgroundImageUrl;
    if (window.matchMedia("(max-width: 575px)").matches) {
      homeBackgroundImageUrl =
        home_page_data.featured_media_metadata.sizes.large.url;
    } else {
      homeBackgroundImageUrl = home_page_data.featured_media_metadata.sizes.xl
        ? home_page_data.featured_media_metadata.sizes.xl.url
        : home_page_data.featured_media_metadata.sizes.original.url;
    }

    // Custom Fields for Home Page
    // acf field path is a bit different here (...theme.color_theme because we've used a clone field in the admin
    // this should be standardized across all pages/sections
    // and we should not be aware of ACF at this point anyways ...
    const { color_theme } = home_page_data.acf.theme || {};

    return (
      <Section
        key="0"
        title="Home"
        className={classNames(color_theme)}
        containerClassName={classNames("ContentContainerHome", "container")}
        data={home_page_data}
        ContentContainer={contentContainerHome}
        sectionStyles={{
          backgroundImage: `url(${homeBackgroundImageUrl})`,
          // height: '100vh', //this.state.windowHeight || 'auto',
        }}
        id="home"
        path={`/${this.state.lang.code}`}
        ref={this._storeSectionRef}
        onEnter={this._onEnterSection}
        onLeave={this._onLeaveSection}
      />
    );
  }

  _renderSections() {
    // build sections out of main menu
    const sections = this.state.data.primary_navigation.map(item => {
      // we're extracting the object from the data store
      // meaning that we need to have the object in store
      // we'll add lazy fetching later if needed
      const data = this._buildSectionData(item);
      return data ? (
        <Section
          key={item.id}
          title={item.title}
          data={data}
          className={classNames(data.color_theme, data.content_template)}
          containerClassName={classNames(
            data.content_template !== "ContentContainerCarousel"
              ? "container"
              : "",
            data.content_template
          )}
          sectionStyles={
            {
              // minHeight: '100vh', // this.state.windowHeight || 0,
            }
          }
          ContentContainer={ContentContainers[data.content_template]}
          siteHeaderHeight={this.state.headerHeight}
          isFetching={data.isFetching}
          id={item.slug}
          path={item.path}
          ref={this._storeSectionRef}
          onEnter={this._onEnterSection}
          onLeave={this._onLeaveSection}
          allowBackgroundToLoad={this.state.allowSectionsImagesToload}
          /* scrollHintElement={
                  index < this.state.data.primary_navigation.length - 1
                  ? <Link to={this.state.data.primary_navigation[index+1].path}><img src={appData.ui.scroll_hint} /></Link>
                  : null
                } */
        />
      ) : (
        ""
      );
    });

    // add Home
    sections.unshift(this._renderHome());

    return sections;
  }

  /** Footer */

  _renderFooter() {
    return (
      <Section
        key="footer"
        title="Footer"
        className="dark"
        containerClassName={classNames("ContentContainerFooter", "container")}
        data={{
          site_name: this.state.data.site_name,
          site_description: this.state.data.site_description,
          ...this.state.data.theme_options,
        }}
        ContentContainer={ContentContainers["ContentContainerFooter"]}
        id="footer"
        path={null}
        ref={this._storeSectionRef}
        onEnter={this._onEnterSection}
        onLeave={this._onLeaveSection}
      />
    );
  }

  /** Navigation */

  _renderRoutes() {
    const routes = [];

    // a route for each main menu item
    routes.push(
      this.state.data.primary_navigation.map(item => (
        <Route
          key={item.id}
          path={item.path}
          exact={false}
          render={route_props => {
            //  here we need to check if the ref to the section has been stored so it can be used
            // this helps as we're first rendering the page and the refs to the Sections are not accessible for render
            //  we are also checking if we are not manually scrolling into a section
            // if we are we will unmount the ScrollToRouteHelper component as soon as we enter another section
            //  i.e. setState is called in _onEnterSection and thus the route is re-rendered but this time ... allowScroll is false
            // this will allow ScrollToRouteHelper to be mounted again next time we trigger the route
            // and thus trigger a scroll to the Section
            // this is necessary because the scroll is triggered on ScrollToRouteHelper componentDidMount
            // note: scroll could be triggered on componentDidUpdate ... this has to be explored
            if (this.sections[item.slug] && this.allowScroll) {
              document.title = `${appData.site_name} - ${item.title}`;
              ReactGA.pageview(
                window.location.pathname + window.location.search
              );
              return (
                <ScrollToRouteHelper
                  ease="in-out-quad"
                  duration={500}
                  targetComponent={this.sections[item.slug]}
                  // as the scroll is triggered when the route is matched
                  // the headerHeight has not changed to the collapsed height
                  // so we get it directly from the DOM - computing what it will be
                  offset={
                    this.state.headerIsCollapsed
                      ? this.state.headerHeight
                      : this._getCollaspsedHeaderHeight()
                  }
                  {...route_props}
                />
              );
            } else {
              return null;
            }
          }}
        />
      ))
    );

    // a route for Home
    routes.push(
      <Route
        key="0"
        path={`(/${this.state.lang.code})?/`}
        exact={true}
        render={route_props => {
          if (this.sections.home && this.allowScroll) {
            document.title = `${appData.site_name} - ${
              appData.site_description
            }`;
            ReactGA.pageview(window.location.pathname + window.location.search);
            return (
              <ScrollToRouteHelper
                targetComponent={this.sections.home}
                offset={this.state.headerHeight}
                {...route_props}
              />
            );
          } else {
            return null;
          }
        }}
      />
    );

    return routes;
  }

  _onEnterSection(section) {
    // we need to flag the fact that we're 'scrolling' into the section
    // main reason is to be able to unmount the ScrollToRouteHelper as we scroll into a section - @see _renderRoutes()
    this.allowScroll = false;

    // we also want to track which section is active - for Nav items highlighting mainly
    this.setState(
      () => {
        return {
          activeSectionId: section.props.id,
          headerIsCollapsed: section.props.id !== "home",
        };
      },
      () => {
        // we're done entering - we need to 're-activate' the routing mechanism for nav links
        setTimeout(() => (this.allowScroll = true), 0);
      }
    );
  }

  _onLeaveSection() {}

  _storeSectionRef(element) {
    if (!element) {
      return;
    }
    this.sections[element.props.id] = element;
  }

  _onMobileMenuItemClickHandler() {
    if (window.matchMedia("(max-width: 575px)").matches) {
      this.allowScroll = !this.allowScroll;
      this._toggleMobileMenu();
    }
  }

  _onMobileMenuButtonOpenClickHandler() {
    this.allowScroll = false;
    this._toggleMobileMenu();
  }

  _onMobileMenuButtonCloseClickHandler() {
    this.allowScroll = false;
    this._toggleMobileMenu();
  }

  _toggleMobileMenu() {
    this.setState(state => ({ mobileMenuIsHidden: !state.mobileMenuIsHidden }));
  }

  render() {
    return (
      <div>
        {this._renderHeader()}

        {this._renderSections()}

        {/* this._renderFooter() */}

        <Switch>{this._renderRoutes()}</Switch>
      </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(App);
