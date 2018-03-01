@extends('layouts.app')
@section('content') 
  @include('partials.header') 
  @if (!have_posts())
    <section id="page-404" class="ContentContainerArchive">
      <div class="container ContentContainerArchive">
        <div class="section-content">
          <div class="content-container">
            <div class="alert alert-warning">
              <p>{{ __('Sorry, but the page you were trying to view does not exist.', 'cominst') }}</p>
              <p>{{ __('Please use the menu above to navigate to any section of our site', 'cominst') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  @endif
  @include('partials.footer')
@endsection
