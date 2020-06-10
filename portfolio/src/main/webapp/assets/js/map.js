const markers = [
  {
    lat: 41.725295,
    lng: -74.20442,
    title: "The Gunks",
    description: "Some of the best Trad Climbing on the East Coast",
  },
  {
    lat: 22.607288,
    lng: -83.724946,
    title: "Vinales",
    description:
      "Although not recognized by the government, Cuban climbing is alive and thriving",
  }, // vinales
  {
    lat: 35.66817,
    lng: -91.724883,
    title: "Jamestown Crag",
    description:
      "Stopped here for some sport climbs on the drive from LA to NY",
  },
  {
    lat: 40.253574,
    lng: -75.813578,
    title: "Birdsboro Quarry",
    description: "Boasts the most sport routes within 2 hours of NY",
  },
  {
    lat: 35.221,
    lng: -114.029,
    title: "Kingman",
    description: "Gorgeous views. Amazing sandstone.",
  },
  {
    lat: 34.565,
    lng: -117.119,
    title: "Apple Valley",
    description:
      "Where I first learned to set anchors on lead climbing outdoors",
  },
  {
    lat: 40.441,
    lng: -75.101,
    title: "High Rocks",
    description: "Closest outdoor sport climbing from NYC. Beware the bugs.",
  },
];

/** Creates a map that shows places I've climbed */
function createMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.5, lng: -98.35 },
    zoom: 3,
  });

  for (let i = 0; i < markers.length; i++) {
    addLandmark(
      map,
      markers[i]["lat"],
      markers[i]["lng"],
      markers[i]["title"],
      markers[i]["description"]
    );
  }
}

/** Adds a marker that shows an info window when clicked. */
function addLandmark(map, lat, lng, title, description) {
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: title,
  });

  const infoWindow = new google.maps.InfoWindow({ content: description });
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}
