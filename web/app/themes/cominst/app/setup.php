<?php

namespace App;

use Roots\Sage\Container;
use Roots\Sage\Assets\JsonManifest;
use Roots\Sage\Template\Blade;
use Roots\Sage\Template\BladeProvider;

/**
 * Theme assets
 */
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('cominst/main.css', asset_path('styles/main.css'), false, null);
    wp_enqueue_script('cominst/main.js', asset_path('scripts/main.js'), [], null, true);
}, 100);

/**
* Make data availabe to JS
**/
add_action('wp_enqueue_scripts', function () {
    wp_localize_script(
        'cominst/main.js',
        'appData',
        [
            'site_name' => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'posts' => Api::get_posts(get_option( 'posts_per_page' )),
            'posts_per_page' => get_option( 'posts_per_page' ),
            'all_posts_ids_and_slugs' => Api::get_all_posts_ids_and_slugs(),
            'categories' => Api::get_categories(),
            'taxonomies' => Api::get_taxonomies(),
            'post_types' => Api::get_post_types(),
            'pages' => Api::get_top_pages(),
            // 'references_by_sectors' => Api::get_references_by_sectors(),
            'primary_navigation' => Api::get_primary_navigation(),
            'theme_options' => Api::get_theme_options(),
            'lang' => defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : 'fr',
            'languages' => function_exists('icl_get_languages') ? icl_get_languages('skip_missing=0&orderby=custom') : 'fr',
            'home_url' => get_home_url(),
            'template_directory_uri' => get_stylesheet_directory_uri(),
            'uploads_path' => wp_upload_dir(),
            'assets_path' => asset_path(''),
            'ui' => [
                'brand_logo' => asset_path('images/logo-cominst.svg'),
                'scroll_hint' => asset_path('images/chevron-down.svg'),
                'expand_button' => asset_path('images/add.svg'),
            ],
            'home_page_id' => get_option( 'page_on_front' ),
            'blog_page_id' => get_option( 'page_for_posts' ),
            'i18n' => [
                'contact_details' => __('Contact details', 'cominst'),
                'social_networks' => __('Social Networks', 'cominst'),
                'follow_us' => __('Follow Us', 'cominst'),
                'newsletter' => __('Newsletter', 'cominst'),
                'newsletterSubscribeForm' => [
                    'inputPlaceholder' => __('Your email', 'cominst'),
                    'btnLabel' => __('Send', 'cominst'),
                    'sending' => __('Sending...', 'cominst'),
                    'success' => __('Thank you for subscribing.', 'cominst'),
                    'error' => __('There seems to be a problem with this email address.', 'cominst'),
                ]
            ],
            'ga_ID' => 'UA-90471175-1'
        ]
    );
}, 100);

// we need to get a translated menu for the REST API:
// as we are requesting the menu per theme location
// and that the wp-api-menus plugin directly request a menu
// with the ID that is returned by get_theme_mod( 'nav_menu_locations' );
// (this ID is the ID of the menu in the source language)
// and then calls wp_get_nav_menu_object with this ID
// and that WPML filters the requested menu in wp_nav_menu
// before wp_get_nav_menu_object
// we need to do our own filtering ...
add_action(
    'wp_get_nav_menu_object',
    function($menu_obj, $menu) {
        // get menu id
        $menu_id = $menu;
        if(is_object($menu)) {
            $menu_id = $menu->term_id;
        }
        if(function_exists('icl_object_id')) {
            $translated_menu_id = icl_object_id($menu_id, 'nav_menu');
            if($menu_id !== $translated_menu_id) {
                $menu_obj = wp_get_nav_menu_object($translated_menu_id);
            }
        }
        return $menu_obj;
    },
    10,
    2
);

/* add_action( 'init', function () {
    wp_deregister_script('heartbeat');
}); */

/**
 * Theme setup
 */
add_action('after_setup_theme', function () {
    /**
     * Enable features from Soil when plugin is activated
     * @link https://roots.io/plugins/soil/
     */
    add_theme_support('soil-clean-up');
    add_theme_support('soil-jquery-cdn');
    add_theme_support('soil-nav-walker');
    add_theme_support('soil-nice-search');
    add_theme_support('soil-relative-urls');

    /**
     * Enable plugins to manage the document title
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
     */
    add_theme_support('title-tag');

    /**
     * Register navigation menus
     * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
     */
    register_nav_menus([
        'primary_navigation' => __('Primary Navigation', 'sage')
    ]);

    /**
     * Enable post thumbnails
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support('post-thumbnails');

    /**
     * Enable HTML5 markup support
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
     */
    add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);

    /**
     * Enable selective refresh for widgets in customizer
     * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
     */
    add_theme_support('customize-selective-refresh-widgets');

    /**
     * Use main stylesheet for visual editor
     * @see resources/assets/styles/layouts/_tinymce.scss
     */
    add_editor_style(asset_path('styles/main.css'));

    /** Load string translations */
    load_theme_textdomain('cominst', get_template_directory() . '/languages');

    /** Images Sizes */
    add_image_size('xl', 1920, 0);
}, 20);

/**
 * Register sidebars
 */
add_action('widgets_init', function () {
    $config = [
        'before_widget' => '<section class="widget %1$s %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>'
    ];
    register_sidebar([
        'name'          => __('Primary', 'sage'),
        'id'            => 'sidebar-primary'
    ] + $config);
    register_sidebar([
        'name'          => __('Footer', 'sage'),
        'id'            => 'sidebar-footer'
    ] + $config);
});

/**
 * Updates the `$post` variable on each iteration of the loop.
 * Note: updated value is only available for subsequently loaded views, such as partials
 */
add_action('the_post', function ($post) {
    sage('blade')->share('post', $post);
});

/**
 * Setup Sage options
 */
add_action('after_setup_theme', function () {
    /**
     * Add JsonManifest to Sage container
     */
    sage()->singleton('sage.assets', function () {
        return new JsonManifest(config('assets.manifest'), config('assets.uri'));
    });

    /**
     * Add Blade to Sage container
     */
    sage()->singleton('sage.blade', function (Container $app) {
        $cachePath = config('view.compiled');
        if (!file_exists($cachePath)) {
            wp_mkdir_p($cachePath);
        }
        (new BladeProvider($app))->register();
        return new Blade($app['view']);
    });

    /**
     * Create @asset() Blade directive
     */
    sage('blade')->compiler()->directive('asset', function ($asset) {
        return "<?= " . __NAMESPACE__ . "\\asset_path({$asset}); ?>";
    });
});

add_action( 'send_headers', function() {
	if ( ! did_action('rest_api_init') && $_SERVER['REQUEST_METHOD'] == 'HEAD' ) {
		header( 'Access-Control-Allow-Origin: *' );
		header( 'Access-Control-Expose-Headers: Link' );
		header( 'Access-Control-Allow-Methods: HEAD' );
	}
} );

/**
 * Register ACF options page
 */
add_action(
    'acf/init',
    function() {
        if (function_exists('acf_add_options_page')) {
            acf_add_options_page(array(
              'page_title' => __('Options du thème', 'cominst'),
              'menu_title' => __('Options du thème', 'cominst'),
              'menu_slug' => 'theme-general-settings',
              'post_id' => 'theme-general-settings',
              'capability' => 'manage_options',
              'redirect' => false
            ));
        }
    }
);


// we want to be able to modify the
/* add_filter(
    'wpml_active_languages_access',
    function ($languages) {
        foreach($languages as $key => $lang) {
            if($lang['code'] === 'zh-hans') {
                $languages[$key]['code'] = 'cn';
            }
        }
        return $languages;
    }
); */
