import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileInputComponent } from './file-input/file-input.component';
import { AlertComponent } from './alert/alert.component';
import { MainPageComponent } from './main-page/main-page.component';
import { Component } from '@angular/compiler/src/core';
import { ReadalComponent } from './readal/readal.component';

@NgModule({
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

export const routes: Routes = [
  { path: 'Home', component: MainPageComponent },
  { path: 'readAl', component: ReadalComponent },
  { path: '',  redirectTo: 'Home', pathMatch: 'full' },
];

export const endpoints: any = {
  MainPageComponent: 'trimAl'
};
