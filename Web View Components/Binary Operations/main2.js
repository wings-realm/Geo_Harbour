
const map = L.map('map').setView([0, 0], 2); // Centered on (0, 0)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let geojson1, geojson2, unionResultLayer;

function loadAndPlotGeoJSON(file, color) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const geojson = JSON.parse(e.target.result);

      // Plot GeoJSON on the map
    //   const layer = L.geoJSON(geojson, {
    //     style: {
    //       fillColor: color,
    //       color: 'white',
    //       weight: 2,
    //       opacity: 1,
    //       fillOpacity: 0.7
    //     }
    //   }).addTo(map);

      if (!geojson1) {
        geojson1 = geojson;
      } else if (!geojson2) {
        geojson2 = geojson;
      }

      // Zoom to the bounds of the uploaded GeoJSON
    };

    reader.readAsText(file);
}

function performIntersect() {
    const fileInput1 = document.getElementById('fileInput1');
    const fileInput2 = document.getElementById('fileInput2');

    // You can set colors or customize them based on your needs
    const color1 = 'blue';
    const color2 = 'blue';

    // Load and plot GeoJSON for the first file
    loadAndPlotGeoJSON(fileInput1.files[0], color1);

    // Load and plot GeoJSON for the second file
    loadAndPlotGeoJSON(fileInput2.files[0], color2);

    // Wait for both GeoJSON files to be loaded and then perform intersection
    setTimeout(() => {
        // Perform Turf.js intersection operation
        const intersectResult = turf.intersect(geojson1, geojson2);

        // Remove previous union result layer if exists
        if (unionResultLayer) {
            map.removeLayer(unionResultLayer);
        }

        // Plot the intersection result on the map
        unionResultLayer = L.geoJSON(intersectResult, {
            style: {
                color: 'green',
                weight: 2
            }
        }).addTo(map);

        // Zoom to the bounds of the intersection result
        map.fitBounds(unionResultLayer.getBounds());
    }, 500); // Adjust the delay based on your needs
}
function performUnion() {
    const fileInput1 = document.getElementById('fileInput1');
    const fileInput2 = document.getElementById('fileInput2');

    // You can set colors or customize them based on your needs
    const color1 = 'blue';
    const color2 = 'blue';

    // Load and plot GeoJSON for the first file
    loadAndPlotGeoJSON(fileInput1.files[0], color1);

    // Load and plot GeoJSON for the second file
    loadAndPlotGeoJSON(fileInput2.files[0], color2);
    setTimeout(() => {
        // Perform Turf.js union operation
        const unionResult = turf.union(geojson1, geojson2);

        // Remove previous union result layer if exists
        if (unionResultLayer) {
            map.removeLayer(unionResultLayer);
        }

        // Plot the union result on the map
        unionResultLayer = L.geoJSON(unionResult, {
            style: {
                color: 'red',
                weight: 2
            }
        }).addTo(map);

        // Zoom to the bounds of the union result
        map.fitBounds(unionResultLayer.getBounds());
    }, 500); // Adjust the delay based on your needs
}

function perform1() {
    const fileInput1 = document.getElementById('fileInput1');

    // You can set colors or customize them based on your needs
    const color1 = 'blue';

    // Load and plot GeoJSON for the first file
    loadAndPlotGeoJSON(fileInput1.files[0], color1);
         const layer = L.geoJSON(geojson1, {
        style: {
          fillColor: color1,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        }
      }).addTo(map);

    // Load and plot GeoJSON for the second file

    // Rest of your existing code for union operation

    // Perform Turf.js union operation
    const unionResult = turf.union(geojson1, geojson2);

    // Remove previous union result layer if exists
    if (unionResultLayer) {
      map.removeLayer(unionResultLayer);
    }

    // Plot the union result on the map
    unionResultLayer = L.geoJSON(unionResult, {
      style: {
        color: 'red',
        weight: 2
      }
    });
    // Zoom to the bounds of the union result
    map.fitBounds(unionResultLayer.getBounds());
}
function perform2() {

    const fileInput2 = document.getElementById('fileInput2');

    // You can set colors or customize them based on your needs

    const color2 = 'blue';


    // Load and plot GeoJSON for the second file
    loadAndPlotGeoJSON(fileInput2.files[0], color2);
         const layer = L.geoJSON(geojson2, {
        style: {
          fillColor: color2,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        }
      }).addTo(map);

    // Rest of your existing code for union operation

    // Perform Turf.js union operation
    const unionResult = turf.union(geojson1, geojson2);

    // Remove previous union result layer if exists
    if (unionResultLayer) {
      map.removeLayer(unionResultLayer);
    }

    // Plot the union result on the map
    unionResultLayer = L.geoJSON(unionResult, {
      style: {
        color: 'red',
        weight: 2
      }
    });
    // Zoom to the bounds of the union result
    map.fitBounds(unionResultLayer.getBounds());
}
