import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { UpperMenuComponent } from './upper-menu/upper-menu.component';
import { AppRoutingModule } from './/app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { HomeBodyComponent } from './home-body/home-body.component';

import { routes } from './app-routing.module';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    UpperMenuComponent,
    HomeBodyComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
