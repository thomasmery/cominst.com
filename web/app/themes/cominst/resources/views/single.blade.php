@extends('layouts.app')
@section('content')
  @include('partials.header')
  @while(have_posts()) @php(the_post())
    <section id="the-post" class="ContentContainerArchive">
      <div class="container ContentContainerArchive">
        <div class="section-content">
          <div class="content-container content-container-archive">
            <div class="row">
              <div class="col-sm-4 sidebar">
                <div>
                  <div class="header">
                    <h2 class="title">{!! get_post(get_option( 'page_for_posts' ))->post_title !!}</h2>
                    <div class="spinner"></div>
                  </div>
                  <ul class="nav">
                    {{-- <li class="item">
                      <a href="{!! get_permalink(get_option( 'page_for_posts' )) !!}">{!! get_field('subtitle', get_option( 'page_for_posts' )) !!}</a>
                    </li> --}}
                    @foreach ($categories as $category )
                      <li class="item">
                        <a
                          href="{!! get_term_link($category->term_id, 'category') !!}"
                          class="{!! in_array($category->name, $post_categories_names) ? 'active' : '' !!}"
                        >
                            {!! $category->name !!}
                        </a>
                      </li>
                    @endforeach
                  </ul>
                </div>
              </div>
              <div class="col-sm-8 content">
              <div class="posts">
                  <article class="child-content-container post">
                    <div class="header">
                      <div class="{!! $post_meta_data_container_classes !!}">
                        @if ( empty($post_medias) )
                          @foreach ($post_categories as $category)
                            <span class="category">
                              {{ $category->name }}
                            </span>
                          @endforeach
                        @else
                          @foreach ($post_medias as $media)
                            <span class="meta-data-media">
                              <span>{{ $media->name }} </span>
                            </span>
                          @endforeach
                        @endif
                        <span>
                          <span class="meta-data-date">@php(the_date())</span>
                        </span>
                      </div>
                      <h1 class="title">@php(the_title())</h1>
                    </div>
                    <div class="content">
                      <div>
                        @php(the_content())
                      </div>
                    </div>
                  </article>
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
