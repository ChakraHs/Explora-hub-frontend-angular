import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  selectCard(cardType: string): void {
    // Assuming you have latitude, longitude, and description for each card type
    let data: any;

    switch(cardType) {
      case 'food':
        data = { latitude: 2, longitude: 10, description: '...' };
        break;
      case 'places':
        data = { latitude: 35, longitude: 12, description: '...' };
        break;
      case 'trips':
        data = { latitude: 123, longitude: 67, description: '...' };
        break;
      default:
        data = {};
    }

    // Navigate to map display component with selected data
    this.router.navigate(['/explore'], { state: { data } });
  }

}
