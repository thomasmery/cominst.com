<!doctype html>
<html @php(language_attributes())>
  @include('partials.head')
  <body @php(body_class())>
    @yield('content')
    @php(wp_footer())
  </body>
</html>
