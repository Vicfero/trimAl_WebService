import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';
import { CookieService } from 'ng2-cookies';
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

  constructor(public localStorage: TrackerService, private http: HttpClient) {

  }

  ngOnInit() {
  }

  trimBy(method: string): void {
    const vari = this.http.get(`http://127.0.0.1:5000/trim/` + method + '/' + this.localStorage.data['Alignment']);
    vari.subscribe(
      (res: any) => { console.log('Trim Sucesss'); console.log(res); },
      (error: any) => { console.log(error); },
      // () => console.log('Duh')
    );
    return;
  }
}

class TrimmingOption {
  name: string;
  description: string;
  endpoint: string;
  from: string;
  result: string;
  constructor(name: string, description: string, endpoint: string) {
    this.name = name;
    this.description = description;
    this.endpoint = endpoint;
    this.from = '';
    this.result = '';
  }
}
