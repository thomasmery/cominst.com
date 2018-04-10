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
                    $address = get_field('address', 'theme-general-settings');
                    $phone_number = get_field('phone_number', 'theme-general-settings');
                    $contact_email = get_field('contact_email', 'theme-general-settings');

                    $data['ContactPoint'] = [
                        [
                            "@type" => "ContactPoint",
                            "address" => $address,
                            "telephone" => $phone_number,
                            "email" => $contact_email,
                            "contactType" => "Secrétariat / Contact",
                        ]
                    ];
                }
                return $data;
            }
        );
    endif;
}
add_action( 'plugins_loaded', 'cominst_init_seo' );