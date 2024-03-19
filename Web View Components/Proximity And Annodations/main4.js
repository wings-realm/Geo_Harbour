
const map = L.map('map').setView([28.385331, 77.306881], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const fixedPoint = turf.point([77.303428, 28.382787]);
const buffered = turf.buffer(fixedPoint, 500, { units: 'meters' });

map.on('click', function (e) {
  const clickedPoint = turf.point([e.latlng.lng, e.latlng.lat]);
  const distance = turf.distance(clickedPoint, fixedPoint, { units: 'kilometers' });

  const annotationMarker = L.marker([e.latlng.lat, e.latlng.lng], {
    icon: L.divIcon({ className: 'annotation-marker', html: '<div class="annotation-marker-icon"></div>' })
  }).addTo(map);

  annotationMarker.bindPopup(`<b>Latitude:</b> ${e.latlng.lat}<br><b>Longitude:</b> ${e.latlng.lng}<br><b>Distance:</b> ${distance.toFixed(2)} Kilometers`);
});

function loadGeoJSON(file, keyword, radius) {
  const reader = new FileReader();
  const fixedPoint = turf.point([77.303428, 28.382787]);
const buffered = turf.buffer(fixedPoint, radius/1000, { units: 'kilometers' });

// Convert the buffered area to a Leaflet layer
L.geoJSON(buffered).addTo(map);

  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      const filteredData = filterGeoJSON(data, keyword, radius);

      const geoJSONLayer = L.geoJSON(filteredData, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng);
        },
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.Name) {
            layer.bindPopup('<h3>' + feature.properties.Name + '</h3><p>' + feature.properties.description + '</p>');
          }
        }
      }).addTo(map);
    } catch (error) {
      console.error('Error parsing GeoJSON:', error);
    }
  };

  reader.readAsText(file);
}

function filterGeoJSON(data, keyword, radius) {
  const fixedPoint = turf.point([77.303428, 28.382787]);
  
  const filteredData = data.features.filter(feature => {
    const distance = turf.distance(
      turf.point(feature.geometry.coordinates),
      fixedPoint,
      { units: 'meters' }
    );

    const nameContainsKeyword = feature.properties.Name.toLowerCase().includes(keyword.toLowerCase());

    return distance <= radius && nameContainsKeyword;
  });

  return { type: "FeatureCollection", features: filteredData };
}

function plotGeoJSON() {
  const filePicker = document.getElementById('filePicker');
  const keyword = document.getElementById('keyword').value;
  const radius = parseFloat(document.getElementById('radius').value);

  if (!filePicker.files[0] || !keyword || isNaN(radius)) {
    alert('Please choose a valid GeoJSON file and enter valid values for keyword and radius.');
    return;
  }

  map.eachLayer(layer => {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });

  const selectedFile = filePicker.files[0];
  loadGeoJSON(selectedFile, keyword, radius);
}

function downloadMap() {
  // Create a data URL of the map image and open it in a new window for download
  const mapImageDataURL = map.toDataURL();
  const downloadLink = document.createElement('a');
  downloadLink.href = mapImageDataURL;
  downloadLink.download = 'annotated_map.png';
  downloadLink.click();
}
