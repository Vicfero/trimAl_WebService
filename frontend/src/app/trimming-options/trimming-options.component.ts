import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-trimming-options',
  templateUrl: './trimming-options.component.html',
  styleUrls: ['./trimming-options.component.css']
})
export class TrimmingOptionsComponent implements OnInit {
  @Input() stepper: StepperComponent;

  methods = [
    new TrimmingOption('Strict', 'Trims the alignment searching for the optimum threshold for gaps and similarity'),
    new TrimmingOption('Gappyout', 'Trims the alignment searching for the optimum threshold for gaps'),
    new TrimmingOption('No Gaps', 'Trims the alignment removing all columns that contain a gap'),
    new TrimmingOption('No All Gaps', 'Trims the alignment removing columns that contain only gaps'),

  ];

  constructor() { }

  ngOnInit() {
  }

}

class TrimmingOption {
  name: string;
  description; string;
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
