<header class="mobile-menu-hidden" style="height: 129px;">
  <div class="container">
    <h2 class="title">
      <a href="{{ home_url('/') }}">{{ get_bloginfo('name', 'display') }}</a>
    </h2>
    <div class="row">
      <div class="col-sm-1 col-left text-left">
        <a class="brand-logo" href="{{ home_url('/') }}">
          <img src="@asset('images/logo-cominst.svg')">
        </a>
        <h3 class="site-description">{{ get_bloginfo('description', 'display') }}</h3>
      </div>
      <div class="col-sm-10 col-center text-center">
        <div class="mobile-menu-button mobile-menu-button-close">
          <i class="fa fa-close" aria-hidden="true"></i>
        </div>
        <a class="brand-logo" href="/fr">
          <img src="@asset('images/logo-cominst.svg')">
        </a>
        <div class="nav-container">
          <nav>
            @foreach ($main_nav_items as $item )
              <a href="{{ $item->url }}">{{ $item->title }}</a>
            @endforeach
          </nav>
        </div>
        <div class="d-sm-none lang-switcher-container">
          <ul class="nav lang-switcher">
            <li class="active">
              <a href="/fr">fr</a>
            </li>
            <li class="">
              <a href="/en">en</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-sm-1 col-right text-right">
        <ul class="nav lang-switcher">
          <li class="active">
            <a href="/fr">fr</a>
          </li>
          <li class="">
            <a href="/en">en</a>
          </li>
        </ul>
        <div class="mobile-menu-button mobile-menu-button-open">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</header>