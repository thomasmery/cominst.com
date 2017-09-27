/* eslint-disable no-console */
/* global appData */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import WPAPI from 'wpapi';

import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Header from './Header';
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

    this.state = {
      lang: {
        code: appData.lang || 'fr',
      },
      activeSectionId: null,
      data: {
        posts: appData.posts,
      },
    }

    this._onEnterSection = this._onEnterSection.bind(this);
    this._onLeaveSection = this._onLeaveSection.bind(this);

    this._storeSectionRef = this._storeSectionRef.bind(this);

  }

  componentDidMount () {
    getClient(appData.home_url).then(
      (client) => {
        client.posts().then(
          (posts) =>
            this.setState( () => {
              return { data: { posts } }
            }
          )
        )
      }
    );
  }

  _renderPosts () {
    return this.state.data.posts.map((post) => <h3 key={ post.id }>{ post.title.rendered } </h3>)
  }

  _renderNav () {
    return (
      <nav>
        { this._renderNavLink( { text: 'Nos Services', slug: 'nos-services' } ) }
        { this._renderNavLink( { text: 'Nos valeurs', slug: 'nos-valeurs' } ) }
        { this._renderNavLink( { text: 'Blog', slug: 'blog' } ) }
      </nav>
    );

  }

  _renderNavLink ({ text, slug }) {
    return (
      <Link
        to={ `/${this.state.lang.code}/${slug}` }
        className={ classNames( { active: slug === this.state.activeSectionId } ) }
      >
          { text }
      </Link>
    );
  }

  _onEnterSection (section) {
    this.setState( { activeSectionId: section.props.id });
    console.log('onEnter', this.state.activeSectionId);
  }

  _onLeaveSection (section) {
    console.log('onLeave', section.props.title);
  }

  _storeSectionRef (element) {
    if(!element) {
      return;
    }
    this.sections[element.props.id] = element;
  }

  render() {

    return <div>
      <Header title="Communication & Institutions">
        { this._renderNav() }
      </Header>

      <Route path="/(en|fr)/" render={ () => <ScrollToRouteHelper targetComponent={this.sections['intro']} />} />
      <Route path="/(en|fr)/nos-services" render={ () => <ScrollToRouteHelper targetComponent={this.sections['nos-services']} />} />
      <Route path="/(en|fr)/nos-valeurs" render={ () => <ScrollToRouteHelper targetComponent={this.sections['nos-valeurs']} />} />
      <Route path="/(en|fr)/blog" render={ () => <ScrollToRouteHelper targetComponent={this.sections['blog']} />} />

      <Section
        title="Intro"
        id="intro"
        ref={this._storeSectionRef}
        onEnter={ this._onEnterSection }
        onLeave={ this._onLeaveSection }>
      </Section>
      <Section
        title="Nos Services"
        id="nos-services"
        ref={this._storeSectionRef}
        onEnter={ this._onEnterSection }
        onLeave={ this._onLeaveSection }>
      </Section>
      <Section
        title="Nos valeurs"
        id="nos-valeurs"
        ref={this._storeSectionRef}
        onEnter={ this._onEnterSection }
        onLeave={ this._onLeaveSection }>
      </Section>
      <Section
        title="Blog"
        id="blog"
        ref={this._storeSectionRef}
        onEnter={ this._onEnterSection }
        onLeave={ this._onLeaveSection }>
          { this._renderPosts() }
        </Section>
    </div>

  }

}

export default App;
