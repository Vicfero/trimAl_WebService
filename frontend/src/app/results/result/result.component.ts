import { Component, OnInit, Input } from '@angular/core';
import { TrackerService } from '../../tracker.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver/FileSaver';
import { StepperComponent } from '../../stepper/stepper.component';

@Component({
  selector: '[app-result]',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @Input() method: string = null;
  @Input() id: string = null;
  @Input() stepper: StepperComponent;
  info: any;

  URL = 'http://127.0.0.1:5000/download/';

  constructor(public localStorage: TrackerService, private http: HttpClient) {
    
   }

  ngOnInit() {
  }

  download() {
    const downloadURL :string = this.URL + this.id;
    const vari = this.http.get(downloadURL, { responseType: 'text' });
    
    vari.subscribe(
      (res: any) => { 
        console.log(res);   
        var blob = new Blob([res], { type: 'text/plain' });
        saveAs(blob, this.id)
        },
      (error: any) => { console.log(error); },
    );
    return;
  }

}
