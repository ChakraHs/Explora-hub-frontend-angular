import { Component } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';


interface Place {
  latitude: number;
  longitude: number;
  selected: boolean;
}

interface PlaceInfo {
  title: string;
  description: string;
  imageUrl: string;
  selected: boolean;
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {
  map!: L.Map;
  marker!: L.Marker;
  latitude: number = 0;
  longitude: number = 0;
  watchId!: number;

  // List of available places
  places: string[] = [
    "bab el had, Rabat",
    "Hassan Tower, Rabat",
    "Kasbah of the Udayas, Rabat",
    "Mausoleum of Mohammed V, Rabat",
    "Chellah, Rabat"
  ];

  // List of available places with additional information
  placesInfo: PlaceInfo[] = [
    {
      title: 'Bab el Had',
      description: 'Description of Bab el Had, Rabat',
      imageUrl: '../../../assets/img/bab_elhad.jpg',
      selected: false
    },
    {
      title: 'Hassan Tower',
      description: 'Description of Hassan Tower, Rabat',
      imageUrl: '../../../assets/img/tour_hassan2.jpg',
      selected: false
    },
    {
      title: 'Kasbah of the Udayas',
      description: 'Description of Kasbah of the Udayas, Rabat',
      imageUrl: '../../../assets/img/kasbah.jpg',
      selected: false
    },
    // Add more places with their information as needed
  ];

  placesC:string[] = [];

  // Selected places
  selectedPlaces: string[] = [];

  // Store marker references
  markers: { [key: string]: L.Marker } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        if (!this.map) {
          this.initMap();
        } else {
          this.updateMarker();
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  initMap() {
    this.map = L.map('map').setView([this.latitude, this.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Use your custom image from assets/img folder
  const imageUrl = '../../../assets/img/placeholder.png';
  const initialBounds: L.LatLngBoundsExpression = [[this.latitude + 0.002, this.longitude - 0.002], [this.latitude + 0.006, this.longitude + 0.002]];
  const imageOverlay = L.imageOverlay(imageUrl, initialBounds).addTo(this.map);

  // Update image bounds when the map is zoomed
  this.map.on('zoomend', () => {
    const zoomLevel = this.map.getZoom();
    const updatedBounds = this.calculateImageBounds(zoomLevel);
    imageOverlay.setBounds(updatedBounds);
  });
}

calculateImageBounds(zoomLevel: number): L.LatLngBounds {
  // Adjust the latitude and longitude offsets based on the current zoom level
  const latitudeOffset = 0.002 / Math.pow(2, zoomLevel - 13);
  const longitudeOffset = 0.006 / Math.pow(2, zoomLevel - 13);

  // Define the corners of the image overlay
  const southWest = L.latLng(this.latitude + latitudeOffset, this.longitude - latitudeOffset);
  const northEast = L.latLng(this.latitude + longitudeOffset, this.longitude + latitudeOffset);

  // Return the bounds for the image overlay
  return L.latLngBounds(southWest, northEast);
}

  updateMarker() {
    const newLatLng = new L.LatLng(this.latitude, this.longitude);
    this.marker.setLatLng(newLatLng); // Update marker position
    this.map.setView(newLatLng, this.map.getZoom()); // Update map view
  }

  // Add or remove a place from the selected list
  togglePlace(place: string) {
    const index = this.selectedPlaces.indexOf(place);
    if (index !== -1) {
        this.selectedPlaces.splice(index, 1); // Remove if already selected
        this.removeMarker(place); // Remove marker if already added
    } else {
        this.selectedPlaces.push(place); // Add if not selected
        this.addMarker(place); // Add marker
    }
    console.log('placesSelected ', this.selectedPlaces);
}
  // toggleSelectBox(place: PlaceInfo) {
  //   place.selected = !place.selected;
  // }

  addMarker(place: string) {
    this.http.get<any>('http://localhost:5000/get-coordinates', { params: { place: place } })
      .subscribe(data => {
        const coordinates = data;
        if (coordinates.latitude && coordinates.longitude) {
          const icon = L.icon({
            iconUrl: '../../../assets/img/marker.png', // Path to your custom marker icon
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 32], // Anchor point of the icon
            popupAnchor: [0, -32] // Popup anchor
          });

          const marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: icon }).addTo(this.map)
            .bindPopup(place)
            .openPopup();

          // Store the marker in the markers object
          this.markers[place] = marker;
        } else {
          console.error('Coordinates not found for:', place);
        }
      }, error => {
        console.error('Error fetching coordinates for:', place);
      });
}
  
  removeMarker(place: string) {
    console.log('Removing marker for place:', place);
    console.log('Existing markers:', this.markers);
    const marker = this.markers[place];
    console.log('Retrieved marker:', marker);
    if (marker) {
        marker.remove();
        delete this.markers[place];
        console.log('Marker removed successfully');
    } else {
        console.log('Marker not found for place:', place);
    }
}


  // Check if a place is selected
  isPlaceSelected(place: string): boolean {
    return this.selectedPlaces.includes(place);
  }

  // Calculate the best path using selected places
  calculateBestPath() {
    if (this.selectedPlaces.length < 2) {
      console.error('Please select at least two places to calculate the best path.');
      return;
    }

    // Prepare data to send to the backend
  const requestData = {
    places: this.selectedPlaces,
    latitude: this.latitude.toString(),
    longitude: this.longitude.toString()
  };
  
    // Fetch coordinates of selected places
  this.http.post<any>('http://localhost:5000/calculate-best-path', { places: this.selectedPlaces }).subscribe(
    response => {
      if (response.bestPath && response.bestPath.length >= 2) {
        // Extract coordinates from the response
        const coordinates = response.bestPath.map((place:string) => place);
        
        // Set the coordinates to placesC
        this.placesC = coordinates;
        console.log('places ',this.placesC)
        console.log('placesSelected ',this.selectedPlaces)

        // Fetch coordinates of selected places
        const coordinatesRequests = this.placesC.map(place =>
          this.http.get<any>('http://localhost:5000/get-coordinates', { params: { place: place } })
        );

        console.log('cordinates ',coordinatesRequests);
        // Wait for all coordinate requests to complete
        forkJoin(coordinatesRequests).subscribe(responses => {
          const coordinates = responses.map(response => [response.latitude, response.longitude]);

          // Create polyline using coordinates of selected places
          const polyline = L.polyline(coordinates, { color: 'red' }).addTo(this.map);

          // Fit the map bounds to the polyline
          this.map.fitBounds(polyline.getBounds());
        }, error => {
          console.error('Error fetching coordinates:', error);
        });

      } else {
        console.error('Invalid response from server:', response);
      }
    },
    error => {
      console.error('Error fetching coordinates:', error);
    }
  );
  }
}
