import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SelectionComponent } from './selection/selection.component';
import { ExploreComponent } from './explore/explore.component';
import { LoginComponent } from './login/login.component';
import { PlacesComponent } from './places/places.component';



@NgModule({
  declarations: [
    HomeComponent,
    SelectionComponent,
    ExploreComponent,
    LoginComponent,
    PlacesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
