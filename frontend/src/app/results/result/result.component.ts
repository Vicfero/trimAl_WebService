import { Component, OnInit, Input } from '@angular/core';
import { TrackerService } from '../../tracker.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: '[app-result]',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @Input() method: string = null;
  @Input() id: string = null;

  URL = 'http://127.0.0.1:5000/download/';

  constructor(public localStorage: TrackerService, private http: HttpClient) {
    
   }

  ngOnInit() {
  }

  download() {
    const downloadURL :string = this.URL + this.id;
    const vari = this.http.get(downloadURL);
    vari.subscribe(
      (res: any) => { console.log(res) },
      // (error: any) => { console.log(error); },
    );
    return;
  }

}
