


const map = L.map('map').setView([0, 0], 2); // Centered on (0, 0)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let geojson1;

function loadAndPlotGeoJSON(file, color) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const geojson = JSON.parse(e.target.result);
      if (!geojson1) {
        geojson1 = geojson;
      }
    };
    reader.readAsText(file);
}

function UploadFile() {
    const fileInput1 = document.getElementById('fileInput1');
    const color1 = 'blue';
    loadAndPlotGeoJSON(fileInput1.files[0], color1);
}
function PlotFile() {
    unionResultLayer = L.geoJSON(geojson1, {
      style: {
        color: 'red',
        weight: 2
      }
    }).addTo(map);
    map.fitBounds(unionResultLayer.getBounds());
}
function GetArea(){
    var area = turf.area(geojson1);
    console.log(area);
    var areaResultDiv = document.getElementById('areaResult');
    areaResultDiv.innerHTML = 'Area: ' + area.toFixed(2) + ' square meters';
}
function GetCentroid(){
    var centroid = turf.centroid(geojson1);
    var centroidMarker = L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]])
        .bindPopup('Centroid: ' + centroid.geometry.coordinates.join(', '))
        .addTo(map);
}
function GetLength(){
    var length = turf.length(geojson1, {units: 'miles'});
    var areaResultDiv = document.getElementById('areaResult');
    areaResultDiv.innerHTML = 'Length: ' + length.toFixed(2) + ' miles';
}
function GetConcave(){
    var options = {units: 'miles', maxEdge: 1};
    var hull = turf.concave(geojson1, options);
    var hullLayer = L.geoJSON(hull, {
        style: {
            color: 'orange',
            weight: 2
        }
    }).addTo(map);

    // Zoom to the bounds of the concave hull
    // map.fitBounds(hullLayer.getBounds());
}
