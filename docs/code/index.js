// NAVBAR
window.addEventListener('DOMContentLoaded', () => {
    const currentLocation = window.location.href; // Get the current URL
    const links = document.querySelectorAll('#navbar-mid a'); // Select all anchor tags

    links.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active'); // Add active class to the current link
        }
    });
});

// MAP

let g_map;
window.initMap = initMap;
let userMarker = null;

let userPosition = [];
let geolocationFound = false;
function geolocationSuccess(pos) {
    userPosition[0] = pos.coords.longitude;
    userPosition[1] = pos.coords.latitude;
    if (!geolocationFound){doTheAPI();}
    geolocationFound = true;

    const currentPosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
    };

    console.log("Current Location:", currentPosition);

    if (!userMarker) {
        // Create a blue marker for the user's location
        userMarker = new google.maps.Marker({
            position: currentPosition,
            map: g_map,
            title: "You are here",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillOpacity: 1,
                strokeWeight: 2,
                fillColor: '#5384ED',
                strokeColor: '#ffffff',
            },
        });

    } else {
        // Update position if marker and circle already exist
        userMarker.setPosition(currentPosition);
        userCircle.setCenter(currentPosition);
        userCircle.setRadius(pos.coords.accuracy);
    }

    // Center map to the user's location
    g_map.setCenter(currentPosition);
}

function initMap() {
    console.log("Initializing map...");

    let properties = {
        zoom: 17,
        center: { lat: 51.50081315558437, lng: -2.5465649388591314 },
        loading: "lazy",
    };

    let element = document.getElementById('map');
    if (!element) {
        console.error("Map element not found!");
        return;
    }

    g_map = new google.maps.Map(element, properties);
    console.log("Map initialized");

    navigator.geolocation.watchPosition(
        geolocationSuccess,
        (error) => console.warn("Geolocation error:", error.message),
        { enableHighAccuracy: true }
    );

}

let markers = [];

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function doTheAPI(){
    let url = "https://maps2.bristol.gov.uk/server2/rest/services/ext/ll_community_and_safety/MapServer/0/query?outFields=*&where=1%3D1&f=geojson";

    clearMarkers();

    fetch(url)
        .then(response => response.json())
        .then(json_data => {
            console.log("API data:", json_data);

            // Check if features exist in the response
            if (json_data && json_data.features) {
                // Display API data in a list
                displayApiData(json_data); // Function to show API data in the list

                // Add markers to the map
                addMarkers(json_data);
            } else {
                console.error("No features in API response.");
            }
        })
        .catch(error => console.error("Error fetching API data:", error));
}
function addMarkers(json) {
    let features = json.features;

    if (!features || features.length === 0) {
        console.warn("No data available from the API.");
        return;
    }

    console.log(`Adding markers, total features: ${features.length}`);

    for (let i = 0; i < features.length; i++) {
        const g = features[i].geometry;

        if (g && g.coordinates && g.coordinates.length === 2) {
            const lng = g.coordinates[0];
            const lat = g.coordinates[1];

            // Custom icon (with size adjustment)
            const icon = {
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Default red icon URL
                scaledSize: new google.maps.Size(20, 20), // Adjust this size as needed (width, height)
                origin: new google.maps.Point(0, 0), // Optional: Specifies the origin of the image
                anchor: new google.maps.Point(10, 10), // Optional: The point of the image to anchor at marker position
            };

            const marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: g_map,
                title: features[i].properties.FEATURE_LOCATION || "CCTV Location",
                icon: icon, // Set the custom icon here
            });

            markers.push(marker); // Add to marker array

            // Optional: Add info windows
            if (features[i].properties) {
                const infoWindow = new google.maps.InfoWindow({
                    content: `<p><strong>${features[i].properties.FEATURE_LOCATION}</p>`,
                });

                marker.addListener("click", () => {
                    infoWindow.open(g_map, marker);
                });
            }
        } else {
            console.warn(`Invalid coordinates for feature ${i}:`, g.coordinates);
        }
    }

    console.log(`Added ${markers.length} markers to the map.`);
}

// display API data in the list
function displayApiData(json) {
    const dataList = document.getElementById('api-data');
    dataList.innerHTML = ''; // Clear existing list items (if any)

    const features = json.features;

    if (!features || features.length === 0) {
        console.warn("No data available from the API.");
        return;
    }

    console.log(`Displaying ${features.length} items in the list`);

        let sortedArray = [{geometry:{coordinates:[0,0]}}];
        console.log("starting sorting sequence")

        features.forEach((feature) => {
            for (let i = 0; i < sortedArray.length; i++) {
                let distance1 = getDistance(sortedArray[i].geometry.coordinates, userPosition);
                let distance2 = getDistance(feature.geometry.coordinates, userPosition);
                if (distance1 > distance2) {
                    sortedArray.splice(i, 0, feature);
                    console.log(sortedArray);
                    break;
                }
            }
        });
        sortedArray.splice(sortedArray.length - 1, 1);

        console.log("sorting finished");

    sortedArray.forEach((feature, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('api-item'); // Optional: Add a class for styling

        // Display data as list item, adjust this based on what data you want to show
        listItem.innerHTML = `
            <strong>Location ${index + 1}:</strong> ${feature.properties.FEATURE_LOCATION || 'Unnamed Location'}<br>
        `;
        dataList.appendChild(listItem);  // Add the item to the list
    });
}

function getDistance(pos1, pos2) {
    let lat1 = (Math.PI/180) * pos1[1];
    let lat2 = (Math.PI/180) * pos2[1];
    let lng1 = (Math.PI/180) * pos1[0];
    let lng2 = (Math.PI/180) * pos2[0];

    const earthRadius = 6371;
    let kmDistance = 2 * earthRadius *
        Math.asin(Math.sqrt(Math.pow((Math.sin((lat2 - lat1) / 2)), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow((Math.sin(
                (lng2 - lng1) / 2)), 2) ));
    return kmDistance;
}

