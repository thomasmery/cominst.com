@extends('layouts.app')
@section('content')
  @include('partials.header')
  @while(have_posts())
    @php(the_post())
    <style>
      .section-main {
        background-image: none;
      }
      @media only screen and (min-width: 768px) {
        .section-main {
          background-image: url({!! get_the_post_thumbnail_url(null, 'large'); !!});
        }
      }
      @media only screen and (min-width: 1024px) {
        .section-main {
          background-image: url({!! get_the_post_thumbnail_url(null, 'xl'); !!});
        }
      }
    </style>
    <section id="{{ $post_slug }}" class="section-main {!! (get_field('color_theme') ? get_field('color_theme') : 'light') !!} @php(the_field(('content_template')))">
      <div class="container ContentContainerPagesAndSidebarNavigation">
        <div class="section-content">
          <div class="content-container content-container-pages-and-sidebar-navigation">
            <div class="row">
              <div class="col-md-12"></div>
              <div class="col-md-4 sidebar">
                <div>
                  <h2 style="cursor: pointer;">{{ $sub_pages_nav_title }}</h2>
                  <ul class="nav">
                    @foreach ($sub_pages_nav_items as $page )
                      <li class="item">
                        <a href="{{ $page->url }}">{{ $page->title }}</a>
                    </li>
                    @endforeach
                  </ul>
                </div>
              </div>
              <div class="col-md-8 pages">
                <div>
                  <div class="child-content-container">
                    <div>
                      <div>
                        <div class="header">
                          <h1 class="title">@php(the_title())</h1>
                          <h4 class="subtitle">@php(the_field(('subtitle')))</h4>
                        </div>
                        <div class="content">
                          @php(the_content())
                        </div>
                        <div class="actions"></div>
                      </div>
                    </div>
                  </div>
                  <div class="child-image image">
                    <img width="250" height="169" src="http://www.cominst.localhost/app/uploads/2017/12/salle-de-réunion-full-b-w-e1513428798661.jpg"
                      class="attachment-sm size-sm" alt="" srcset="http://www.cominst.localhost/app/uploads/2017/12/salle-de-réunion-full-b-w-e1513428798661.jpg 4942w, http://www.cominst.localhost/app/uploads/2017/12/salle-de-réunion-full-b-w-e1513428798661-150x101.jpg 150w, http://www.cominst.localhost/app/uploads/2017/12/salle-de-réunion-full-b-w-e1513428798661-516x349.jpg 516w, http://www.cominst.localhost/app/uploads/2017/12/salle-de-réunion-full-b-w-e1513428798661-768x519.jpg 768w, http://www.cominst.localhost/app/uploads/2017/12/salle-de-réunion-full-b-w-e1513428798661-1024x692.jpg 1024w"
                      sizes=" (min-width: 576px) 250px, 100vw">
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
                                        <a class="link-icon link-email" href="mailto:secretariat@cominst.com" target="_blank"
                                            rel="noopener">Contactez-nous</a>
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