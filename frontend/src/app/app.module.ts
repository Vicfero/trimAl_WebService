import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { UpperMenuComponent } from './upper-menu/upper-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FileInputComponent } from './file-input/file-input.component';

import { routes } from './app-routing.module';
import { FileUploadModule } from 'ng2-file-upload';
import { TrimmingOptionsComponent } from './trimming-options/trimming-options.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgStepperModule } from './stepper/stepper.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadStatusComponent } from './file-input/file-upload-status/file-upload-status.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    UpperMenuComponent,
    FileInputComponent,
    TrimmingOptionsComponent,
    MainPageComponent,
    FileUploadStatusComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FileUploadModule,
    ScrollToModule.forRoot(),
    NgStepperModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
