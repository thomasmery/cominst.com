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
                      <h1 class="title">@php(the_title())</h1>
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
  @endwhile
  @include('partials.footer')
@endsection