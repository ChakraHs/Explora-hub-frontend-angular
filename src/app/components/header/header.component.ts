import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private router: Router,
    ) {

  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  confirmLogout() {
    const confirmation = window.confirm('Are you sure you want to logout?');

    if (confirmation) {
      this.logout();
    } else {
      this.navigateTo("logout");
      // User clicked "Cancel" or closed the dialog
      // You can add additional logic if needed
    }
  }
  selectedLanguage: any = 'en'; // Default language

  onLanguageChange(event: Event) {
    // Extract the selected value from the event
    const selectedValue = (event.target as HTMLSelectElement).value;

    // Update the selected language
    this.selectedLanguage = selectedValue;

    // Implement additional logic if needed
    console.log('Selected Language:', this.selectedLanguage);

    // Save the selected language in localStorage
    localStorage.setItem('selectedLanguage', selectedValue);

    // this.translate.use(selectedValue);
  }


  isAuthenticated = true;

  // Initial navItems property
  originalNavItems = [
    { label: 'Home', link: '/home' },
    { label: 'Services', link: '/services' },
    { label: 'Places', link: '/places' },
    { label: 'Login', link: '/login' },
  ];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  getModifiedNavItems(): any[] {
    const isAuthenticated:boolean = true;

    // Create a copy of the original navItems array
    const modifiedNavItems = [...this.originalNavItems];

    // Find the "Login" item and update its label based on the session status
    const loginItemIndex = modifiedNavItems.findIndex(item => item.label === 'Login'|| item.label === 'Logout');
    if (loginItemIndex !== -1) {
      modifiedNavItems[loginItemIndex].label = isAuthenticated ? 'Logout' : 'Login';
      // console.log("is authentified: ", isAuthenticated);
    }

    // const dashboardItemIndex = modifiedNavItems.findIndex(item => item.label === 'Dashboard');
    // // Add "Dashboard" link if the user is authenticated
    // if (dashboardItemIndex== -1 && isAuthenticated) {
    //   modifiedNavItems.push({ label: 'Dashboard', link: '/dashboard' });
    // }

    return modifiedNavItems;
  }

  // Use the getModifiedNavItems() method in your template to dynamically update the navItems
  get navItems(): any[] {
    return this.getModifiedNavItems();
  }
  

  // Logout function
  logout(): void {
    // this.authService.logout();
    this.navigateTo('/login'); // Redirect to the login page or any other desired page after logout
    // this.cdr.detectChanges();
  }

  isActive(link: string): boolean {
    return this.router.isActive(link, true);
  }
}
