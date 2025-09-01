/* eslint-disable */
// Google Maps implementation
export const displayMapGoogle = locations => {
  // Initialize the map
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: locations[0]
      ? { lat: locations[0].coordinates[1], lng: locations[0].coordinates[0] }
      : { lat: 0, lng: 0 },
    scrollwheel: false,
    zoomControl: true,
    disableDefaultUI: false,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#7c93a3' }, { lightness: '-10' }],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry',
        stylers: [{ visibility: 'on' }, { lightness: 20 }],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#4b6878' }],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [{ color: '#f5f5f2' }, { lightness: 20 }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#b3ddd1' }],
      },
    ],
  });

  // Create bounds object to fit all markers
  const bounds = new google.maps.LatLngBounds();

  locations.forEach((loc, index) => {
    const position = { lat: loc.coordinates[1], lng: loc.coordinates[0] };

    // Create marker
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: `Day ${loc.day || index + 1}: ${loc.description}`,
      icon: {
        url: '/img/pin.png',
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40),
      },
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="text-align: center; font-family: 'Lato', sans-serif; padding: 10px;">
          <p><strong>Day ${loc.day || index + 1}:</strong><br>${
        loc.description
      }</p>
        </div>
      `,
    });

    // Add click listener to marker
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Extend bounds to include this marker
    bounds.extend(position);
  });

  // Fit map to show all markers
  if (locations.length > 0) {
    map.fitBounds(bounds);

    // Add padding
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
    });
  }
};

// Usage with API key in HTML:
// <script async defer
//   src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
// </script>
