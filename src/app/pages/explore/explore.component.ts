import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {
  map!: L.Map;
  marker!: L.Marker;
  latitude: number=0;
  longitude: number=0;
  watchId!: number;

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

    this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map)
      .bindPopup('Your Location')
      .openPopup();
  }

  updateMarker() {
    const newLatLng = new L.LatLng(this.latitude, this.longitude);
    this.marker.setLatLng(newLatLng); // Update marker position
    this.map.setView(newLatLng, this.map.getZoom()); // Update map view
  }
}
