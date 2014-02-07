var geocoder = new google.maps.Geocoder();

jQuery(document).ready(function(){
	
	$(function (){
        $('#search').submit(function(ev){
          //this happens if form is submitted
          //prevent the default behavior of a form (it should do nothing in our case)
          ev.preventDefault();

          //Get our form data
		  address = document.getElementById('where').value;
		  if (address != '') { 
			  geocoder.geocode( { 'address': address}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
				  latitude = parseFloat(results[0].geometry.location.d);
				  longitude = parseFloat(results[0].geometry.location.e);
				
  				  $.goMap.setMap({latitude: latitude, longitude: longitude});
				
      	          distance = document.getElementById("distance").innerHTML.replace(" km", ".0");
				
				  //send an ajax request to our action
		          $.ajax({
			        type: "POST",
		            url: "/search",
		            //serialize the form and use it as data for our ajax request
		            //data: $(this).serialize(),
		            data: "what="+$("#search option:selected").val() + "&latitude=" + latitude + "&longitude=" + longitude + '&distance=' + document.getElementById("distance").innerHTML.replace(" km", ".0"),
		            //the type of data we are expecting back from server, could be json too
		            dataType: "html",
		            success: function(data) {
		              //if our ajax request is successful, replace the content of our results the response data
		              $('#restaurants').html(data);
		            }
		          });
				
		 	    }
			  });
			}	




        });

	});
	
	
});