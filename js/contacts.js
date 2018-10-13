function initContactsMap() {
  var coords = new google.maps.LatLng(49.831792,24.044215);
  var mapOptions = {
    zoom: 17,
    center: coords,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  };

  var map = new google.maps.Map(document.getElementById("gmap_canvas"), mapOptions);
  var marker = new google.maps.Marker({ map, position: coords, icon: '/img/map_pin.svg' });
  var infoWindow = new google.maps.InfoWindow({ content: "<b>Rebbix</b><br/>Levytskogo str. 84<br/>" });

  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map, marker);
  });
}
