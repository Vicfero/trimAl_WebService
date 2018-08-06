import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-trimming-options',
  templateUrl: './trimming-options.component.html',
  styleUrls: ['./trimming-options.component.css']
})
export class TrimmingOptionsComponent implements OnInit {
  @Input() stepper: StepperComponent;

  methods = [
    new TrimmingOption('Strict', 'Trims the alignment searching for the optimum threshold for gaps and similarity', 'strict'),
    new TrimmingOption('Gappyout', 'Trims the alignment searching for the optimum threshold for gaps', 'gappyout'),
    new TrimmingOption('No Gaps', 'Trims the alignment removing all columns that contain a gap', 'nogaps'),
    new TrimmingOption('No All Gaps', 'Trims the alignment removing columns that contain only gaps', 'noallgaps'),
  ];

  lastUploadedAlignment: string;

  constructor(public localStorage: TrackerService, private http: HttpClient) {
    // Subscribe to Observable lastUploadAlignment
    this.localStorage.lastUploadedAlignmentObservable.subscribe(value => {
      this.lastUploadedAlignment = value;
      this.methods.forEach(element => {
        element.result = null;
      });
    });
  }

  ngOnInit() {
  }

  trimBy(option: TrimmingOption): void {
    const vari = this.http.get(`http://127.0.0.1:5000/trim/` + option.endpoint + '/' + this.lastUploadedAlignment);
    option.result = '';
    vari.subscribe(
      (res: any) => {
        option.result = res;
        this.localStorage.lastUploadedAlignmentExpanded['child'][option.endpoint] = res['ID'];
        console.log(this.localStorage.lastUploadedAlignmentExpanded);
      },
    );
    return;
  }
}

class TrimmingOption {
  name: string;
  description: string;
  endpoint: string;
  result: any;

  constructor(name: string, description: string, endpoint: string) {
    this.name = name;
    this.description = description;
    this.endpoint = endpoint;
    this.result = null;
  }
}
