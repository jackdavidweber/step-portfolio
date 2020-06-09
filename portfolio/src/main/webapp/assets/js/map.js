var map;

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA4Cu8t-NfFBtDe7LgTfzqOB2prmSmIQX8&callback=initMap';
script.defer = true;
script.async = true;

window.initMap = function(){
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
}

document.head.appendChild(script);