import { Component, OnInit, Input } from '@angular/core';
import { StepperComponent } from '../../stepper/stepper.component';

@Component({
  selector: 'app-readal-result',
  templateUrl: './readal-result.component.html',
  styleUrls: ['./readal-result.component.css']
})
export class ReadalResultComponent implements OnInit {

  @Input() stepper: StepperComponent;

  constructor() { }

  ngOnInit() {
  }

}
