<?php

function cominst_init_seo() {
    /**
     * Augment Google Knowledge Graph with Organization infos
     * adds to what is already possible with Yoast SEO interface
     */
    if( class_exists('WPSEO_JSON_LD') ):
        add_filter(
            'wpseo_json_ld_output',
            function ($data) {
                // we're relying on ACF
                if( !function_exists('get_field') ) {
                    return;
                }
                
                // only include those infos if an Organization has been setup
                if($data['@type'] === 'Organization') {

                    // necessary informations should be setup in the Theme Options page - General Settings
                    // this option page is setup in includes/acf/global-settings.php

                    $phone_number = get_field('phone_number', 'theme-general-settings');
                    $contact_email = get_field('contact_email', 'theme-general-settings');
                    
                    $data['@type'] = 'Corporation';
                    
                    $data["description"] = 'Cabinet de conseil en affaires publiques et lobbying à Paris';
                    $data['foundingDate'] = '1987-02-26';
                    $data['image'] = $data['logo'];

                    // all other infos are contributed via the admimn (social networks)
                    array_push(
                        $data['sameAs'],
                        home_url('', null)
                    );
                    array_push(
                        $data['sameAs'],
                        'https://www.societe.com/societe/communication-institutions-340388479.html'
                    );
                    
                    // backend contributed address was used when we had a global adress info field
                    // for now replaced by hard coded structured data for 'address' schema.org field
                    // because we don't want to setup the individual address fields in the admin
                    // and can't rely on a regexp to parse the free form address 
                    // $address = get_field('address', 'theme-general-settings');
                    $data['address'] = [
                        '@type' => 'PostalAddress',
                        'addressLocality' => 'Paris',
                        'postalCode' => '75002',
                        'streetAddress' => '32, rue Notre-Dame-des-Victoires',
                        'telephone' => $phone_number,
                    ];

                    $data['ContactPoint'] = [
                        [
                            "@type" => "ContactPoint",
                            "telephone" => $phone_number,
                            "email" => $contact_email,
                            "contactType" => "customer service",
                            "areaServed" => "France",
                        ]
                    ];
                }
                return $data;
            }
        );
    endif;
}
add_action( 'plugins_loaded', 'cominst_init_seo' );