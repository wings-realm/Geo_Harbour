const map = L.map('map').setView([28.385331, 77.306881], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);

function loadGeoJSON(filePath) {
fetch(filePath)
    .then(response => response.json())
    .then(data => {
    // const geoJSONLayer = L.geoJSON(data, {
    //     pointToLayer: function (feature, latlng) {
    //     return L.marker(latlng);
    //     },
    //     onEachFeature: function (feature, layer) {
    //     if (feature.properties && feature.properties.Name) {
    //         layer.bindPopup('<h3>' + feature.properties.Name + '</h3><p>' + feature.properties.description + '</p>');
    //     }
    //     }
    // }).addTo(map);
    // const buffered = turf.buffer(data, 0.250, { units: 'kilometers' });
    // L.geoJSON(buffered).addTo(map);
//     const centroid = turf.centroid(data);
// L.geoJSON(centroid).addTo(map);
// const convexHull = turf.convex(data);
// L.geoJSON(convexHull).addTo(map);
const concaveHull = turf.center(data);
L.geoJSON(concaveHull).addTo(map);
    }
    
    )
    .catch(error => console.error('Error loading GeoJSON data:', error));
}
loadGeoJSON("RestaurantData_GeoJSON.geojson")

const lulc50kWMSLayer = L.tileLayer.wms('https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', {
    layers: 'lulc:DL_LULC50K_1516', // or 'DL_LULC50K_1516'
    version: '1.1.1',
    matrixSet: 'EPSG:4326',
    format: 'image/png',
    transparent: true,
    attribution: 'LULC 50k 15-16'
  }).addTo(map);
// // Centroid operation
// const centroid = turf.centroid(geojsonData);
// L.geoJSON(centroid).addTo(map);

// // Convex operation
// const convexHull = turf.convex(geojsonData);
// L.geoJSON(convexHull).addTo(map);