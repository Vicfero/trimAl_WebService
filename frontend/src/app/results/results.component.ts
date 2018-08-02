import { Component, OnInit, Input } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() stepper: StepperComponent;

  constructor() { }

  ngOnInit() {
  }

}
