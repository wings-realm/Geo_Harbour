

document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('map').setView([28.385331, 77.306881], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let layers = [];

  function loadGeoJSON(filePath) {
    fetch(filePath)
      .then(response => response.json())
      .then(data => {
        const geoJSONLayer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng);
          },
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.Name) {
              layer.bindPopup('<h3>' + feature.properties.Name + '</h3><p>' + feature.properties.description + '</p>');
            }
          }
        }).addTo(map);

        layers.push({ type: 'geojson', layer: geoJSONLayer });
        addCheckbox('geojson', geoJSONLayer);
      })
      .catch(error => console.error('Error loading GeoJSON data:', error));
  }

  function loadKML(filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(kmlData => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(kmlData, 'application/xml');

        const kmlLayer = L.geoJSON(toGeoJSON.kml(xmlDoc), {
          onEachFeature: function (feature, layer) {
            var popupContent = "<h3>KML Feature Information</h3>";
            for (var property in feature.properties) {
              popupContent += "<strong>" + property + ":</strong> " + feature.properties[property] + "<br>";
            }
            layer.bindPopup(popupContent);
          }
        }).addTo(map);

        layers.push({ type: 'kml', layer: kmlLayer });
        addCheckbox('kml', kmlLayer);
      })
      .catch(error => {
        console.error('Error loading KML file:', error);
      });
  }

  function loadShapefile(zipFilePath) {
    fetch(zipFilePath)
      .then(response => response.arrayBuffer())
      .then(zipData => {
        shp.parseZip(zipData).then(geojson => {
          const shapefileLayer = L.geoJSON(geojson, {
            onEachFeature: function (feature, layer) {
              var popupContent = "<h3>Shapefile Feature Information</h3>";
              for (var property in feature.properties) {
                popupContent += "<strong>" + property + ":</strong> " + feature.properties[property] + "<br>";
              }
              layer.bindPopup(popupContent);
            }
          }).addTo(map);

          layers.push({ type: 'shapefile', layer: shapefileLayer });
          addCheckbox('shapefile', shapefileLayer);1
        }).catch(error => {
          console.error('Error converting to GeoJSON:', error);
        });
      })
      .catch(error => {
        console.error('Error loading zip file:', error);
      });
  }

  function loadKMZ(filePath) {
    fetch(filePath)
      .then(response => response.arrayBuffer())
      .then(zipData => {
        // Unzip the KMZ file
        return JSZip.loadAsync(zipData);
      })
      .then(zip => {
        // Extract the KML content from the KMZ file
        const kmlFile = Object.keys(zip.files).find(filename => filename.toLowerCase().endsWith('.kml'));
        if (kmlFile) {
          return zip.files[kmlFile].async('text');
        } else {
          throw new Error('No KML file found in the KMZ archive.');
        }
      })
      .then(kmlData => {
        // Parse KML content to GeoJSON
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlData, 'application/xml');
        const geojson = toGeoJSON.kml(xmlDoc);

        // Add GeoJSON to the map with popups
        const kmzLayer = L.geoJSON(geojson, {
          onEachFeature: function (feature, layer) {
            var popupContent = "<h3>KMZ Feature Information</h3>";
            for (var property in feature.properties) {
              popupContent += "<strong>" + property + ":</strong> " + feature.properties[property] + "<br>";
            }
            layer.bindPopup(popupContent);
          }
        }).addTo(map);

        layers.push({ type: 'kmz', layer: kmzLayer });
        addCheckbox('kmz', kmzLayer);
      })
      .catch(error => {
        console.error('Error loading KMZ file:', error);
      });
  }

  function addCheckbox(type, layer) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = type + 'Checkbox';
    checkbox.checked = true;

    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(type.toUpperCase()));

    document.getElementById('checkbox-container').appendChild(label);

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        console.log(`${type.toUpperCase()} Checkbox Checked`);
        layer.addTo(map);
      } else {
        console.log(`${type.toUpperCase()} Checkbox Unchecked`);
        map.removeLayer(layer);
      }
    });
  }

  // Add Layer button event listener
  document.getElementById('addLayerButton').addEventListener('click', function () {
    const input = document.getElementById('addLayerInput');
    const file = input.files[0];

    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();

      if (fileType === 'zip') {
        // Handle Shapefile
        loadShapefile(URL.createObjectURL(file));
      } else if (fileType === 'kml') {
        // Handle KML
        loadKML(URL.createObjectURL(file));
      } else if (fileType === 'kmz') {
        // Handle KMZ
        loadKMZ(URL.createObjectURL(file));
      } else if (fileType === 'geojson') {
        // Handle GeoJSON
        loadGeoJSON(URL.createObjectURL(file));
      } else {
        console.error('Unsupported file type.');
      }

      // Clear input value after adding layer
      input.value = null;
    } else {
      console.error('No file selected.');
    }
  });

  document.getElementById('capture').addEventListener('click', function() {
    html2canvas(document.getElementById('map'), { useCORS: true }).then(function(canvas) {
        // Create an image from the canvas
        var img = canvas.toDataURL("image/png");

        // Create a link to download the image
        var link = document.createElement('a');
        link.download = 'leaflet_map.png';
        link.href = img;
        link.click();
    }).catch(err => {
        console.error('Error capturing the map:', err);
    });
});
});

