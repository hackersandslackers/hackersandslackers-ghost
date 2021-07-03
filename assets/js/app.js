$(document).ready(function() {

  'use strict';

  // =====================
  // Koenig Gallery
  // =====================
  var gallery_images = document.querySelectorAll('.kg-gallery-image img');

  gallery_images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // =====================
  // Decode HTML entities returned by Ghost translations
  // Input: Plus d&#x27;articles
  // Output: Plus d'articles
  // =====================

  function decoding_translation_chars(string) {
    return $('<textarea/>').html(string).text();
  }

  // =====================
  // Navigation
  // =====================

  $('.js-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.nav-wrap').toggleClass('is-active');
    $(this).toggleClass('nav-toggle--close');
  });

  // =====================
  // Responsive videos
  // =====================

  $('.content').fitVids({
    'customSelector': [ 'iframe[src*="ted.com"]'          ,
                        'iframe[src*="player.twitch.tv"]' ,
                        'iframe[src*="dailymotion.com"]'  ,
                        'iframe[src*="facebook.com"]'
                      ]
  });

  // =====================
  // Images zoom
  // =====================

  $('.content img').attr('data-action', 'zoom');

  // If the image is inside a link, remove zoom
  $('.content a img').removeAttr('data-action');

  // =====================
  // Clipboard URL Copy
  // =====================

  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });

  // =====================
  // Search
  // =====================

  let search_field = $('.js-search-input'),
      search_results = $('.js-search-results'),
      toggle_search = $('.js-search-toggle'),
      search_result_template = "\
      <a href={{link}} class='search-result'>\
        <div class='search-result__content'>\
          <h3 class='search-result__title'>{{title}}</h3>\
          <p class='search-result__excerpt'>{{excerpt}}</p>\
          <time class='search-result__date'>{{pubDate}}</time>\
        </div>\
        <div class='search-result__media'>\
          <div class='search-result__image is-inview' style='background-image: url({{featureImage}})'></div>\
        </div>\
      </a>";

  toggle_search.click(function(e) {
    e.preventDefault();
    $('.js-search').addClass('is-active');

    // If off-canvas is active, just disable it
    $('.js-off-canvas-container').removeClass('is-active');

    setTimeout(function() {
      search_field.focus();
    }, 500);
  });

  $('.search, .js-search-close, .js-search-close .icon').on('click keyup', function(event) {
    if (event.target === this || event.target.className === 'js-search-close' || event.target.className === 'icon' || event.keyCode === 27) {
      $('.search').removeClass('is-active');
    }
  });

  search_field.ghostHunter({
    results: search_results,
    onKeyUp         : true,
    result_template : search_result_template,
    zeroResultsInfo : false,
    displaySearchInfo: false,
    before: function() {
      search_results.fadeIn();
    }
  });

  // =====================
  // Ajax Load More
  // =====================

  let pagination_next_url = $('link[rel=next]').attr('href'),
    $load_posts_button = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    let request_next_link =
      pagination_next_url.split(/page/)[0] +
      'page/' +
      pagination_next_page_number +
      '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text(decoding_translation_chars(pagination_loading_text));
        $load_posts_button.addClass('btn--loading');
      }
    }).done(function(data) {
      let posts = $('.js-post-card', data);

      $('.js-grid').append(posts);

      $load_posts_button.text(decoding_translation_chars(pagination_more_posts_text));
      $load_posts_button.removeClass('btn--loading');

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('btn--disabled').attr('disabled', true);
      }
    });
  });
});

// =====================
// Facebook -> Github
// =====================

$(".github-link").each(function() {
  this.attr('href').replaceAll("https://www.facebook.com/", "")
})