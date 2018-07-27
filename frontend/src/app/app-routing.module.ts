import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileInputComponent } from './file-input/file-input.component';
import { AlertComponent } from './alert/alert.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

export const routes: Routes = [
  { path: 'home', component: MainPageComponent },
  { path: '', component: MainPageComponent },
];
