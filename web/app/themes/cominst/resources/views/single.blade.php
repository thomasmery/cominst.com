@extends('layouts.app')
@section('content') 
  @include('partials.header') 
  @while(have_posts()) @php(the_post())
    <section id="{{ $post_slug }}" class="ContentContainerArchive">
      <div class="container ContentContainerArchive">
        <div class="section-content">
          <div class="content-container content-container-archive">
            <div class="row">
              <div class="col-sm-4 sidebar">
                <div>
                  <div class="header">
                    <h2 class="title">Actualités</h2>
                    <div class="spinner"></div>
                  </div>
                  <ul class="nav">
                    <li class="item">
                      <a aria-current="false" href="/fr/actualites/all">Tous les articles</a>
                    </li>
                    <li class="item">
                      <a aria-current="false" href="/fr/actualites-ci-lobbying">Actualités C&amp;I - Lobbying</a>
                    </li>
                    <li class="active item">
                      <a aria-current="true" href="/fr/ci-dans-les-medias" class="active">C&amp;I dans les médias</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-sm-8 content">
              <div class="posts">
                  <div class="child-content-container post">
                    <div class="header">
                      <div class="meta-data">
                        <span class="category">C&amp;I dans les médias</span>
                        <span>
                          <span>@php(the_date())</span>
                        </span>
                        <span class="meta-data-media">
                          <span>Les Echos - tribune</span>
                        </span>
                      </div>
                      <h1 class="title">@php(the_content())</h1>
                    </div>
                    <div class="content">
                      <div>
                        @php(the_content())
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-hint"></div>
    </section>
    <section id="contact" class="dark">
      <div class="container ContentContainerFooter">
        <div class="section-content">
          <div class="content-container content-container-footer">
            <div class="row content">
              <div class="col-md-8 col-left">
                <a href="https://goo.gl/maps/GDFsAFmQEFu" target="_blank" class="map-container"></a>
              </div>
              <div class="col-md-4 col-right">
                <div class="block contact-details-container">
                  <h3>Nos coordonnées</h3>
                  <p>
                    <p>32, rue Notre-Dame-des-Victoires
                      <br> 75002 Paris
                      <br> France
                      <br> Tél : +33 (0) 1 47 42 53 00
                      <br> Fax : +33 (0) 1 47 42 24 11
                      <br>
                      <a href="mailto:secretariat@cominst.com" target="_blank" rel="noopener">secretariat@cominst.com</a>
                    </p>
                    <p>
                      <a class="link-icon link-email" href="mailto:secretariat@cominst.com" target="_blank" rel="noopener">Contactez-nous</a>
                    </p>
                  </p>
                </div>
                <div class="block map-container">https://goo.gl/maps/GDFsAFmQEFu</div>
                <div class="block social-networks-container">
                  <h3>Nous suivre</h3>
                  <ul class="social-networks">
                    <li class="item">
                      <a href="https://www.linkedin.com/company/communication-&amp;-institutions/" target="_blank">
                        <i class="icon fa fa-linkedin-square" aria-hidden="true"></i>
                      </a>
                    </li>
                    <li class="item">
                      <a href="https://twitter.com/com_inst" target="_blank">
                        <i class="icon fa fa-twitter-square" aria-hidden="true"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <!-- <div class="block block-newsletters-container">
                    <h3>Newsletter</h3>
                    <div class="form-container">
                        <form action="https://thomas-mery.us1.list-manage.com/subscribe/post?u=e9dcc6f157d6a768e8935280c&amp;id=3189b32b9e"
                            method="post" novalidate="">
                            <input type="email" name="EMAIL" required="" placeholder="Votre email" value="">
                            <input type="submit" value="Envoyer">
                            <div class="message"></div>
                        </form>
                    </div>
                </div> -->
              </div>
            </div>
            <div class="row signature">
              <div class="col-sm-12">
                <span class="site-name">© Communications &amp; Institutions</span>
                <span class="separator">-</span>
                <span class="site-description">Le lobbying expert depuis 1983</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  @endwhile
@endsection