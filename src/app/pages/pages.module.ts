import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SelectionComponent } from './selection/selection.component';
import { ExploreComponent } from './explore/explore.component';



@NgModule({
  declarations: [
    HomeComponent,
    SelectionComponent,
    ExploreComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
