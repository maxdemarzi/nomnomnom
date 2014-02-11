var geocoder = new google.maps.Geocoder();

jQuery(document).ready(function(){
	
	$(function (){
        $('#search').submit(function(ev){
          //this happens if form is submitted
          //prevent the default behavior of a form (it should do nothing in our case)
          ev.preventDefault();
          $.goMap.clearMarkers();

		if ( jQuery('#hide-map-button').hasClass('map-collapsed') ) {
			jQuery('#map').animate({ height: '620px' });
			jQuery('#hide-map-button').text('Hide Map').removeClass('map-collapsed').addClass('map-expanded');
		}
		if (jQuery('#advanced-search-button').text() === 'Simple Search') {
			jQuery('#default-search').slideToggle('fast');
			jQuery('#advanced-search').slideToggle('fast');
			jQuery('#advanced-search-button').text('Advanced Search');
			jQuery('#advanced-search-button').removeClass('expanded');
		}


          //Get our form data
		  address = document.getElementById('where').value;
		  if (address != '') { 
			  geocoder.geocode( { 'address': address}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
				  latitude = parseFloat(results[0].geometry.location.d);
				  longitude = parseFloat(results[0].geometry.location.e);
				
  				  $.goMap.setMap({latitude: latitude, longitude: longitude});

				  //send an ajax request to our action
		          $.ajax({
			        type: "POST",
		            url: "/search",
		            data: "what="+$("#search option:selected").val() + 
		                  "&latitude=" + latitude + 
		                  "&longitude=" + longitude + 
		                  "&distance=" + document.getElementById("distance").innerHTML.replace(" km", ".0") +
		                  "&price=" + document.getElementById("price").innerHTML.replace("&lt; ", "").length +
		                  "&rating=" + document.getElementById("rating").innerHTML.replace("&gt;= ", "") +
		                  "&alcohol=" + $("#alcohol-selector-advanced").val() +
		                  "&good=" +  $("#good-selector-advanced").val(),
		            //the type of data we are expecting back from server, could be json too
		            dataType: "html",
		            success: function(data) {
		              //if our ajax request is successful, replace the content of our results the response data
		              $('#restaurants').html(data);
		            }
		          });
								
		 	    }
			  });
			} else {	

				  //send an ajax request to our action
		          $.ajax({
			        type: "POST",
		            url: "/search",
		            data: "what="+$("#search option:selected").val() + 
		                  "&latitude=" + latitude + 
		                  "&longitude=" + longitude + 
		                  "&distance=" + document.getElementById("distance").innerHTML.replace(" km", ".0") +
		                  "&price=" + document.getElementById("price").innerHTML.replace("&lt; ", "").length +
		                  "&rating=" + document.getElementById("rating").innerHTML.replace("&gt;= ", "") +
		                  "&alcohol=" + $("#alcohol-selector-advanced").val() +
		                  "&good=" +  $("#good-selector-advanced").val(),
		            dataType: "html",
		            success: function(data) {
		              $('#restaurants').html(data);
		            }
		          });
               }

        });

	});
	
	
});