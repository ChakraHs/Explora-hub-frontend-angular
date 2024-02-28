import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { SelectionComponent } from './pages/selection/selection.component';
import { LoginComponent } from './pages/login/login.component';
import { PlacesComponent } from './pages/places/places.component';

const routes: Routes = [
    {
        path:"home",
        component:HomeComponent
    },
    {
        path:"",
        component:HomeComponent
    },
    {
        path:"selection",
        component:SelectionComponent
    },
    {
        path:"explore",
        component:ExploreComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"places",
        component:PlacesComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }