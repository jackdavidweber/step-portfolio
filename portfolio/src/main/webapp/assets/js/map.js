var map;
var markers = [
    {lat: 41.725295, lng: -74.204420 }, // gunks
    {lat: 22.607288, lng: -83.724946 }, // vinales
    {lat: 35.668170, lng: -91.724883 }, // jamestown crag
    {lat: 40.253574, lng: -75.813578 }, // Birdsboro Quarry
    {lat: 35.221, lng: -114.029 }, // Kingman
    {lat: 34.565, lng: -117.119 }, // Apple Valley
    {lat: 40.441, lng: -75.101 }, // High Rocks
]

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA4Cu8t-NfFBtDe7LgTfzqOB2prmSmIQX8&callback=initMap';
script.defer = true;
script.async = true;

window.initMap = function(){
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.50, lng: -98.35 },
    zoom: 3
  });

  for (i=0; i<markers.length; i++){
      new google.maps.Marker({position: markers[i], map: map});
  }

}

document.head.appendChild(script);