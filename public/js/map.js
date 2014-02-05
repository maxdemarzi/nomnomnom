var latitude = 41.8819;
var longitude = -87.6278;

/* global document */
jQuery(document).ready(function(){

	jQuery('#map').goMap({
		maptype: 'ROADMAP',
        latitude: latitude, 
        longitude: longitude,
        zoom: 13,
        scaleControl: true,
        scrollwheel: false,
		markers: [
		]
	});
						            
	var locations=new Array({ coords: {
								latitude: latitude,
								longitude: longitude
							} 
						});
						
	geoPositionSimulator.init(locations);
	
	if(geoPosition.init())
	{
		geoPosition.getCurrentPosition(showPosition,function(){Console.log("Couldn't get location");},{enableHighAccuracy:true});
	}
	else
	{
		Console.log("Couldn't get location");
	}



	/* Calling goMap() function, initializing map and adding markers. */
	function showPosition(p)
	{
	 	latitude = parseFloat( p.coords.latitude );
		longitude = parseFloat( p.coords.longitude );

        $.goMap.setMap({latitude: latitude, longitude: longitude});

		}
	
	
	/* Hiding all the markers on the map. */
	for (var i in $.goMap.markers) {
		if (this[i] !== 0) {
			$.goMap.showHideMarker(jQuery.goMap.markers[i], false);
		}
	}

	/* Revealing markers from the first group - 'airport' */
	$.goMap.showHideMarkerByGroup('airport', true);

	/* Processing clicks on the tabs under the map. Revealing corresponding to each tab markers. */
	jQuery('#industries-tabs ul li a').click(function(event) {
		/* Preventing default link action */
		event.preventDefault();
		/* Getting current marker group name. Link ID's and marker group names must coincide. */
		var markerGroup = jQuery(this).attr('id');
		/* Changing current active tab. */
		jQuery('#industries-tabs ul li').removeClass('active');
		jQuery(this).parent().addClass('active');
		/* Hiding all the markers on the map. */
		for (var i in jQuery.goMap.markers) {
			if (this[i] !== 0) {
				jQuery.goMap.showHideMarker(jQuery.goMap.markers[i], false);
			}
		}
		/* Revealing markers from the corresponding group. */
		jQuery.goMap.showHideMarkerByGroup(markerGroup, true);
	});

});