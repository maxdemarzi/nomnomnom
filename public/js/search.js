var geocoder = new google.maps.Geocoder();

function codeAddress() {
  var address = document.getElementById('where').value;
  if (address != '') { 
	  geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		  latitude = parseFloat(results[0].geometry.location.d);
		  longitude = parseFloat(results[0].geometry.location.e);
		  console.log("Geocoder:");
		  console.log(latitude);
      	  console.log(longitude);
 	    }
	  });
  }	
}	


jQuery(document).ready(function(){
	
	$(function (){
        $('#search').submit(function(ev){
          //this happens if form is submitted
          //prevent the default behavior of a form (it should do nothing in our case)
          ev.preventDefault();
          codeAddress();
          console.log(latitude);
          console.log(longitude);
          //send an ajax request to our action
          $.ajax({
	        type: "POST",
            url: "/search",
            //serialize the form and use it as data for our ajax request
            //data: $(this).serialize(),
            data: "what="+$("#search option:selected").val() + '&latitude=' + latitude + '&longitude=' + longitude,
            //the type of data we are expecting back from server, could be json too
            dataType: "html",
            success: function(data) {
              //if our ajax request is successful, replace the content of our results the response data
              $('#results').html(data);
            }
          });

        });

	});
	
	
});