import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBodyComponent } from './home-body/home-body.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

export const routes: Routes = [
  { path: 'home', component: HomeBodyComponent },
  { path: '', component: HomeBodyComponent },
  { path: 'alert', component: AlertComponent }

];
