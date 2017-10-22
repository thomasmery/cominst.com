/* eslint-disable no-console */
/* global appData */

/**
 * External dependencies
 */
import React, { Component } from 'react';
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
        <Nav data={this.state.data.primary_navigation} activeSectionId={this.state.activeSectionId} />
      </Header>

      <Route path="/(en|fr)/" exact render={ () => <ScrollToRouteHelper targetComponent={this.sections['intro']} />} />
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
