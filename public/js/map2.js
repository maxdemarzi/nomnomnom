/* global document */
jQuery(document).ready(function(){

		function initialiseMap()
		{
		    var myOptions = {
			      zoom: 4,
			      mapTypeControl: true,
			      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			      navigationControl: true,
			      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
			      mapTypeId: google.maps.MapTypeId.ROADMAP      
			    }	
			map = new google.maps.Map(jQuery('#map'), myOptions);
		}
		function initialise()
		{
			if(geoPosition.init())
			{
				document.getElementById('current').innerHTML="Receiving...";
				geoPosition.getCurrentPosition(showPosition,function(){document.getElementById('current').innerHTML="Couldn't get location"},{enableHighAccuracy:true});
			}
			else
			{
				document.getElementById('current').innerHTML="Functionality not available";
			}
		}

		function showPosition(p)
		{
			var latitude = parseFloat( p.coords.latitude );
			var longitude = parseFloat( p.coords.longitude );
			document.getElementById('current').innerHTML="latitude=" + latitude + " longitude=" + longitude;
			var pos=new google.maps.LatLng( latitude , longitude);
			map.setCenter(pos);
			map.setZoom(14);

			var infowindow = new google.maps.InfoWindow({
			    content: "<strong>yes</strong>"
			});

			var marker = new google.maps.Marker({
			    position: pos,
			    map: map,
			    title:"You are here"
			});

			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});
			
		}

	
});	