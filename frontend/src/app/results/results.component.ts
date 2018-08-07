import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';
import { TrackerService } from '../tracker.service';
import { ResultComponent } from './result/result.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  @Input() stepper: StepperComponent;
  show = false;
  lastUploadedAlignment: string;

  ngOnInit() {
  }
  constructor(public localStorage: TrackerService) {
    // Subscribe to Observable lastUploadAlignment
    this.localStorage.lastUploadedAlignmentObservable.subscribe(value => {
      this.show = true;
      this.lastUploadedAlignment = value;
    });
  }

}
