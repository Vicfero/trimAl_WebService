import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements AfterViewInit {

  @ViewChild(StepperComponent) stepper;

  constructor() {
  }

  ngAfterViewInit() {

  }

  triggerView(value: boolean) {
    if (value) {
      this.stepper.next();
    } else {
      this.stepper.prev();
    }
  }
}
