# Location API Usage Guide

## API Endpoints

### 1. Get Google Maps API Key
This endpoint provides the Google Maps API key for use on the frontend.

```
GET /api/location
```

#### Response
```json
{
  "success": true,
  "apiKey": "YOUR_GOOGLE_MAPS_API_KEY",
  "message": "Use this API key with Google Maps JavaScript API on the frontend to get user location"
}
```

### 2. Geocode an Address
This endpoint converts an address to coordinates (latitude and longitude).

```
POST /api/location/geocode
```

#### Request Body
```json
{
  "address": "1600 Amphitheatre Parkway, Mountain View, CA"
}
```

#### Response
```json
{
  "success": true,
  "location": {
    "lat": 37.4224764,
    "lng": -122.0842499
  },
  "formattedAddress": "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
}
```

## Frontend Implementation Example

### Using the Location API on the Frontend

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Location Example</title>
  <style>
    #map {
      height: 400px;
      width: 100%;
    }
    button {
      margin: 10px 0;
      padding: 8px 16px;
      background-color: #4285F4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #3367D6;
    }
    .coordinates {
      margin-top: 10px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>User Location</h1>
  <button id="getLocation">Get My Location</button>
  <div class="coordinates" id="coordinates"></div>
  <div id="map"></div>

  <script>
    // Variables to store the map and Google Maps API key
    let map;
    let marker;
    let googleMapsApiKey;

    // Fetch the Google Maps API key from the backend
    async function fetchApiKey() {
      try {
        const response = await fetch('/api/location');
        const data = await response.json();
        
        if (data.success) {
          googleMapsApiKey = data.apiKey;
          // Load Google Maps script after getting the API key
          loadGoogleMapsScript(googleMapsApiKey);
        } else {
          console.error('Failed to get API key:', data.message);
        }
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    }

    // Load the Google Maps script
    function loadGoogleMapsScript(apiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize the map
    function initMap() {
      // Default location (can be anywhere, will be updated)
      const defaultLocation = { lat: 0, lng: 0 };
      
      // Create the map
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false
      });
      
      // Create a marker for the user's location
      marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: 'Your Location'
      });
      
      // Add click event listener to the button
      document.getElementById('getLocation').addEventListener('click', getUserLocation);
    }

    // Get the user's current location
    function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            // Update the map with the user's location
            updateLocation(userLocation);
            
            // Display the coordinates
            document.getElementById('coordinates').textContent = 
              `Latitude: ${userLocation.lat.toFixed(6)}, Longitude: ${userLocation.lng.toFixed(6)}`;
          },
          (error) => {
            console.error('Geolocation error:', error);
            alert(`Error getting location: ${error.message}`);
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }

    // Update the map with a new location
    function updateLocation(location) {
      // Update marker position
      marker.setPosition(location);
      
      // Center the map on the new location
      map.setCenter(location);
    }

    // Start the process by fetching the API key
    fetchApiKey();
  </script>
</body>
</html>
```

## Geocoding Example

```javascript
// Example of how to use the geocoding endpoint
async function geocodeAddress(address) {
  try {
    const response = await fetch('/api/location/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Coordinates:', data.location);
      console.log('Formatted address:', data.formattedAddress);
      return data.location;
    } else {
      console.error('Geocoding failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Usage
geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA')
  .then(location => {
    if (location) {
      // Do something with the location coordinates
      console.log(`Lat: ${location.lat}, Lng: ${location.lng}`);
    }
  });
```

## Security Considerations

1. **API Key Restrictions**: The Google Maps API key should be restricted to specific domains/IPs in the Google Cloud Console.
2. **Backend Proxy**: For production applications, consider implementing a proxy on your backend to make Google Maps API requests rather than exposing the API key to the client.
3. **Rate Limiting**: Implement rate limiting on your backend endpoints to prevent abuse.

## Browser Compatibility

The Geolocation API is supported in all modern browsers, but requires HTTPS in most cases for security reasons. 