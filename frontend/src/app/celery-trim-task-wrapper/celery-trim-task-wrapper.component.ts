import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-celery-trim-task-wrapper',
  templateUrl: './celery-trim-task-wrapper.component.html',
  styleUrls: ['./celery-trim-task-wrapper.component.css']
})
export class CeleryTrimTaskWrapperComponent implements OnInit, OnChanges {

  @Input() taskID: string = null;

  status: string = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('taskID' in changes) {
      if (changes['taskID']['currentValue'] != null) {
        this.getTaskStatus();
      }
    }
  }

  getTaskStatus(delay: number = 1000) {
    const vari = this.http.get(`http://127.0.0.1:5000/status/` + this.taskID);
    vari.subscribe(
      (res: any) => {
        this.status = res['Status'];
        if (this.status !== 'SUCCESS') {
          setTimeout(() => {
            this.getTaskStatus(delay + 500);
          }, delay);
        }
      },
      (error: any) => {
        console.log(error);
      },
    );
    return;
  }

}
