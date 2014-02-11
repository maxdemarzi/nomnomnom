/***
Equal Heights function.
***/

(function($) {
	$.fn.equalHeights = function(browserWidth, additionalHeight) {
		// Calculating width of the scrollbar for Firefox
		var scrollbar = 0;
		if (typeof document.body.style.MozBoxShadow === 'string') {
			scrollbar = window.innerWidth - jQuery('body').width();
		} 
		// Getting number of blocks for height correction.
		var blocks = jQuery(this).children().length;
		// Setting block heights to auto.
		jQuery(this).children().css('min-height', 'auto');
		// Initializing variables.
		var currentBlock = 1;
		var equalHeight = 0;
		// Finding the highest block in the selection.
		while (currentBlock <= blocks) {
			var currentHeight = jQuery(this).children(':nth-child(' + currentBlock.toString() + ')').height();
			if (equalHeight <= currentHeight) {
				equalHeight = currentHeight;
			}
			currentBlock = currentBlock + 1;
		}
		// Equalizing heights of columns.
		if (jQuery('body').width() > browserWidth - scrollbar) {
			jQuery(this).children().css('min-height', equalHeight + additionalHeight);
		} else {
			jQuery(this).children().css('min-height', 'auto');
		}
	};
})(jQuery);

/* global document */
jQuery(document).ready(function(){

	/***
     1. Main menu jQuery plugin.
	***/

	jQuery('#sf-menu').superfish();

	/***
     2. Mobile Menu jQuery plugin.
	***/

	jQuery('#sf-menu').mobileMenu({
		switchWidth: 767,
		prependTo: '.main-menu',
		combine: false
	});

	/***
     3. Adding sliders for the advanced search form. Implementing switching between default and advanced search forms.
	***/

	/* Calling slider() function and setting slider options. */
	jQuery('#slider-distance').slider({
		range: 'min',
		value: 10,
		min: 1,
		max: 100,
		slide: function( event, ui ) {
			jQuery('#distance').text( ui.value + ' km' );
		}
	});
	/* Showing the default value on the page load. */
	jQuery('#distance').text( jQuery('#slider-distance').slider('value') + ' km' );

	/* Calling slider() function and setting slider options. */
	jQuery('#slider-rating').slider({
		range: 'min',
		value: 1,
		min: 1,
		max: 5,
		slide: function( event, ui ) {
			jQuery('#rating').text( '>= ' + ui.value );
		}
	});
	/* Showing the default value on the page load. */
	jQuery('#rating').text( '>= ' + jQuery('#slider-rating').slider('value') );

	/* Calling slider() function and setting slider options. */
	jQuery('#slider-price').slider({
		range: 'min',
		value: 1,
		min: 1,
		max: 4,
		slide: function( event, ui ) {
			jQuery('#price').text( '< ' + Array(ui.value + 1).join("$") );
		}
	});
	/* Showing the default value on the page load. */
	jQuery('#price').text( '< ' + Array(jQuery('#slider-price').slider('value') + 1).join("$")   );

	/***
     4. Calling selectbox() plugin to create custom stylable select lists.
	***/

	$('.page-selector select').selectbox({
		animationSpeed: "fast",
		listboxMaxSize: 400
	});
	$('#type-selector-default').selectbox({
		animationSpeed: "fast",
		listboxMaxSize: 400
	});
	$('#good-selector-advanced').selectbox({
		animationSpeed: "fast",
		listboxMaxSize: 400
	});
	$('#alcohol-selector-advanced').selectbox({
		animationSpeed: "fast",
		listboxMaxSize: 400
	});
	$('#category-selector-advanced').selectbox({
		animationSpeed: "fast",
		listboxMaxSize: 400
	});
	$('.language-selector select').selectbox({
		animationSpeed: "fast",
		listboxMaxSize: 400
	});

	/***
     5. Custom logic for switching between search default/advanced forms and hiding/showing map.
	***/

	jQuery('#advanced-search').hide();
	jQuery('#advanced-search-button').click(function(event) {
		/* Preventing default link action */
		event.preventDefault();
		if ( jQuery('#hide-map-button').hasClass('map-collapsed') ) {
			jQuery('#map').animate({ height: '620px' });
			jQuery('#hide-map-button').text('Hide Map').removeClass('map-collapsed').addClass('map-expanded');
		}
		jQuery('#default-search').slideToggle('fast');
		jQuery('#advanced-search').slideToggle('fast');
		if (jQuery(this).text() === 'Advanced Search') {
			jQuery(this).text('Simple Search');
			jQuery(this).addClass('expanded');
		} else {
			jQuery(this).text('Advanced Search');
			jQuery(this).removeClass('expanded');
		}
		
	});

	jQuery('#hide-map-button').click(function(event) {
		event.preventDefault();
		if ( jQuery(this).hasClass('map-expanded') ) {
			if ( jQuery('#advanced-search-button').hasClass('expanded') ) {
				jQuery('#default-search').slideToggle('fast');
				jQuery('#advanced-search').slideToggle('fast');
				jQuery('#advanced-search-button').text('Advanced Search');
				jQuery('#advanced-search-button').removeClass('expanded');
			}
			jQuery('#map').animate({ height: '107px' });
			jQuery(this).text('Show Map').removeClass('map-expanded').addClass('map-collapsed');
		} else {
			jQuery('#map').animate({ height: '620px' });
			jQuery(this).text('Hide Map').removeClass('map-collapsed').addClass('map-expanded');
		}
	});
	
	/***
     6. Logic for custom picture gallery with thumbnails, that appears on company-page.html.
	***/

	jQuery('.photo-thumbnails .thumbnail').click(function() {
		// Setting class "current" to the thumbnail that was clicked.
		jQuery('.photo-thumbnails .thumbnail').removeClass('current');
		jQuery(this).addClass('current');
		// Getting "src" attribute of the image that was clicked.
		var path = jQuery(this).find('img').attr('src');
		// Setting "src" attribute of the big image.
		jQuery('#big-photo img').attr('src', path);
	});

	/***
     7. Adding <input> placeholders (for IE 8-9).
	***/

	jQuery('.text-input-grey, .text-input-black').placeholder();

	/***
     8. Adding autocomplete.
	***/

	jQuery(function() {
		var autosuggestions = [
			"Lunch",
			"Dinner",
			"Shop",
			"Entertainment",
			"Realestate",
			"Sports",
			"Cars",
			"Education",
			"Garden",
			"Mechanic",
			"Offices",
			"Advertising",
			"Industry",
			"Postal",
			"Libraries"
		];
		jQuery('#search-what').autocomplete({
			source: autosuggestions
		});
	});

	/***
     9. Colorbox for portfolio images.
	***/

	jQuery('.portfolio-enlarge').colorbox({ maxWidth: '90%' });

	/***
	10. Boxed version switcher. Theme switcher.
	***/

	jQuery('#boxed-switch').click(function() {
		jQuery('.section').toggleClass('boxed');
	});

	$('#switcher-toggle-button').click(function() {
		if ( $('#theme-switcher').hasClass('visible') == true ) {
			$('#theme-switcher').removeClass('visible').stop(true, false).animate({ left: '-122px' });
		} else {
			$('#theme-switcher').addClass('visible').stop(true, false).animate({ left: 0 });
		}
	});

	$('#color-switcher li').click(function() {
		var color = $(this).attr('class');
		$('#theme-color').attr('href', 'css/' + color + '.css');
	});

	$('#layout-switcher').on('change', function() {
		currentLayout = this.value
		if( currentLayout == 'boxed' ) {
			$('.section').addClass('boxed');
		} else if ( currentLayout == 'fullscreen' ) {
			$('.section').removeClass('boxed');
		}
	});

	$('#background-switcher li').click(function() {
		currentLayout = $('#layout-switcher').val();
		if( currentLayout == 'boxed' ) {
			background = $(this).attr('class');
			$('body').removeClass();
			$('body').addClass(background);
		} else {
			alert('Background is visible only in boxed layout. Please select boxed layout.');
		}
	});

	/***
	11. Login & Register form bubbles.
	***/

	jQuery('#login-link').click(function() {
		jQuery('#login-form').toggle();
		jQuery('#register-form').hide();
	});
	jQuery('#register-link').click(function() {
		jQuery('#register-form').toggle();
		jQuery('#login-form').hide();
	});


});

/* global window */
jQuery(window).load(function(){

	/***
	12. Setting equal heights for required containers and elements on page load.
	***/

	jQuery('.equalize').equalHeights(767, 0);
	jQuery('#subscription-options').equalHeights(450, 1);

	/***
	14. Filter for the portfolio items
	***/

	jQuery('#portfolio-filter input').click(function() {
		jQuery('#portfolio-filter input').removeClass('current');
		jQuery(this).addClass('current');
		var filter = jQuery(this).attr('id');
		if ( filter === 'all' ) {
			jQuery('.portfolio-listing').slideDown('fast');
			jQuery('.portfolio-listing-small').slideDown('fast');
		} else {
			jQuery('.portfolio-listing').slideUp('fast');
			jQuery('.portfolio-listing-small').slideUp('fast');
			jQuery('.portfolio-listing.' + filter).slideDown('fast');
			jQuery('.portfolio-listing-small.' + filter).slideDown('fast');
		}
	});

	/***
	15. Company tabs switchong.
	***/

	$("#company-tabs-active li a").click(function(event) {
		event.preventDefault();
		$("#company-tabs-active li").removeClass('active');
		$(this).parent().addClass('active');
		$('.company-tabs-content').slideUp(500);
		var tabID = $(this).attr('class');
		window.location.hash = tabID;
		$('#' + tabID).delay(500).slideDown(500);
		return false;
	});

	var hash = window.location.hash;
	console.log(hash.slice(1));
	if ( $(hash).length ) {
		$('.company-tabs-content').slideUp(500);
		$(hash).delay(500).slideDown(500);
		$("#company-tabs-active li").removeClass('active');
		$('#company-tabs-active li .' + hash.slice(1)).parent().addClass('active');
	}

	$('.portfolio-layout-links a').click(function(event) {
		event.preventDefault();
		if ( $(this).hasClass('current') == false ) {
			switch(true) {
				case $(this).hasClass('portfolio-1'):
					$('.company-tabs-content').slideUp(300);
					window.location.hash = 'company-tabs-portfolio-1';
					$('#company-tabs-portfolio-1').delay(300).slideDown(300);
					break;
				case $(this).hasClass('portfolio-2'):
					$('.company-tabs-content').slideUp(300);
					window.location.hash = 'company-tabs-portfolio-2';
					$('#company-tabs-portfolio-2').delay(300).slideDown(300);
					break;
				case $(this).hasClass('portfolio-3'):
					$('.company-tabs-content').slideUp(300);
					window.location.hash = 'company-tabs-portfolio-3';
					$('#company-tabs-portfolio-3').delay(300).slideDown(300);
					break;
				case $(this).hasClass('portfolio-4'):
					$('.company-tabs-content').slideUp(300);
					window.location.hash = 'company-tabs-portfolio-4';
					$('#company-tabs-portfolio-4').delay(300).slideDown(300);
					break;
			}
		}
	});

	/***
	16. Specialisations block scripts.
	***/

	$('.specialisation-progressbar').each(function() {
		var currentValue = Number($(this).attr('value'));
		$(this).progressbar({
			value: currentValue
		});
	});
	$('.specialisation .toggle-description-button').click(function() {
		if ( $(this).hasClass('plus-button') == true ) {
			$(this).toggleClass('plus-button minus-button').html('-').siblings('.specialisation-description').slideDown();
		} else {
			$(this).toggleClass('plus-button minus-button').html('+').siblings('.specialisation-description').slideUp();
		}
	});

	/***
	17. Star rating scripts.
	***/

	$('.rating-stars.interactive .star').click(function() {
		$(this).siblings('.star').removeClass('current');
		$(this).addClass('current').parent().addClass('rated');
	});
	
	/***
	18. Company event tabs switching.
	***/

	$('#event-tabs a').click(function(event) {
		event.preventDefault();
		if ( $(this).parent().hasClass('active') == false ) {
			var tabID = $(this).attr('id');
			$('#event-tabs li').removeClass('active');
			$(this).parent().addClass('active');
			$('#event-tabs-content li').slideUp('fast').removeClass('visible');
			$('#event-tabs-content li.' + tabID).slideDown('fast').addClass('visible');
		}
	});
	
});

jQuery(window).resize(function() {

	/***
	19. Setting equal heights for required containers and elements on page resize.
	***/

	jQuery('.zone-content.equalize').equalHeights(767, 0);
	jQuery('#subscription-options').equalHeights(450, 1);

});