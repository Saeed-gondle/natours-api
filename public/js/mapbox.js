/* eslint-disable */
export const displayMap = locations => {
  // Initialize the map
  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // Add OpenStreetMap tile layer (free alternative)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  // Alternative tile layers (uncomment to use different styles)
  // Satellite view
  // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  //   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  // }).addTo(map);

  // Dark theme
  // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  // }).addTo(map);

  // Create bounds object to fit all markers
  const group = new L.featureGroup();

  locations.forEach((loc, index) => {
    // Create custom marker HTML
    const markerHtml = `
      <div class="marker">
        <div class="marker-inner"></div>
      </div>
    `;

    // Create custom icon
    const customIcon = L.divIcon({
      html: markerHtml,
      className: 'custom-div-icon',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    // Add marker
    const marker = L.marker([loc.coordinates[1], loc.coordinates[0]], {
      icon: customIcon,
    }).addTo(map);

    // Add popup
    const popupContent = `<p><strong>Day ${loc.day || index + 1}:</strong><br>${
      loc.description
    }</p>`;
    marker.bindPopup(popupContent, {
      offset: [0, -40],
      closeButton: false,
      className: 'custom-popup',
    });

    // Add marker to group for bounds calculation
    group.addLayer(marker);
  });

  // Fit map to show all markers with padding
  if (locations.length > 0) {
    map.fitBounds(group.getBounds(), {
      padding: [50, 50],
    });
  }
};
