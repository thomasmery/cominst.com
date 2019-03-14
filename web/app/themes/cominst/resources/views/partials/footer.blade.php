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
              <h3>{!! __('Contact details', 'cominst') !!}</h3>
              <p>
                <p>32, rue Notre-Dame-des-Victoires
                  <br> 75002 Paris
                  <br> France
                  <br> Tél : +33 (0) 1 47 42 53 00
                  <br> Fax : +33 (0) 1 47 42 24 11
                  <br>
                  <a href="mailto:secretariat@cominst.com" target="_blank" rel="noopener">secretariat@cominst.com</a>
                </p>
                <div id="contact-form-container"></div>
              </p>
            </div>
            <div class="block map-container">https://goo.gl/maps/GDFsAFmQEFu</div>
            <div class="block social-networks-container">
              <h3>{!! __('Follow Us', 'cominst') !!}</h3>
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
            <div class="block legal-infos-container">
              <h3>{{ $secondary_navigation_title }}</h3>
              <ul class="legal-infos-links">
                 @foreach ($secondary_navigation_items as $item)
                  <li class="item">
                    <a href="{{ $item->url }}">
                      {{ $item->title }}
                    </a>
                  </li>
                 @endforeach
              </ul>
            </div>
          </div>
        </div>
        <div class="row signature">
          <div class="col-sm-12">
            <span class="site-name">© Communications &amp; Institutions</span>
            <span class="separator">-</span>
            <span class="site-description">{!! get_bloginfo('description', 'display') !!}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
