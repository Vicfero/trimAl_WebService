import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { TrackerService } from '../../tracker.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver/FileSaver';
import { StepperComponent } from '../../stepper/stepper.component';

@Component({
  selector: '[app-result]',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnChanges {

  @Input() method: string = null;
  @Input() id: string = null;
  @Input() stepper: StepperComponent;

  @ViewChild('downloadButton') downloadButton: ElementRef<HTMLButtonElement>;

  info: any = {
    'Status': 'Retrieving'
  };

  URL = 'http://127.0.0.1:5000/download/';

  constructor(public localStorage: TrackerService, private http: HttpClient) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('id' in changes) {
      this.expand(changes.id.currentValue);
    } else if ('info' in changes) {
      console.log(changes.info);
    }
  }

  expand(id: string) {
    this.localStorage.ExpandAlignment(id,
      (res) => {
        this.info = res; console.log(res);
        if (this.info.Status !== 'OK' || this.info.Status !== 'Err') {
          setTimeout(() => {
            this.expand(id);
          }, 10000);
        } else {
          this.downloadButton.nativeElement.innerText = this.info.Status;
        }
      });
  }

  download() {
    const downloadURL: string = this.URL + this.id;
    const vari = this.http.get(downloadURL, { responseType: 'text' });

    vari.subscribe(
      (res: any) => {
        console.log(res);
        const blob = new Blob([res], { type: 'text/plain' });
        saveAs(blob, this.id);
      },
      (error: any) => { console.log(error); },
    );
    return;
  }

}
