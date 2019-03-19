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
    <section id="{{ $post_slug }}" class="section-main {!! (get_field('color_theme') ? get_field('color_theme') : '') !!} @php(the_field(('content_template')))">
      <div class="container ContentContainerPagesAndSidebarNavigation">
        <div class="section-content">
          <div class="content-container content-container-pages-and-sidebar-navigation">
            <div class="row">
              <div class="col-md-12"></div>
              <div class="col-md-4 sidebar">
                <div>
                  <h2 style="cursor: pointer;">{!! $sub_pages_nav_title !!}</h2>
                  <ul class="nav">
                    @foreach ($sub_pages_nav_items as $page)
                      <li class="item">
                        <a
                          href="{{ $page->url }}"
                          {{ $page->xfn == 'nofollow' ? 'rel="nofollow"' : '' }}
                          @if ($page->active)
                            class="active"
                          @endif
                        >
                          {{ $page->title }}
                        </a>
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
                        @if ($secondary_image_html)
                          {!! $secondary_image_html !!}
                        @endif
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
  @endwhile
  @include('partials.footer')
@endsection
