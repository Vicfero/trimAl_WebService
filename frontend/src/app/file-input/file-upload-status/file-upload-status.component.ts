import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { delay } from 'q';

@Component({
  selector: 'app-file-upload-status',
  templateUrl: './file-upload-status.component.html',
  styleUrls: ['./file-upload-status.component.css']
})
export class FileUploadStatusComponent {

  // tslint:disable-next-line:no-inferrable-types
  progress: String = '0%';
  message: String = 'Upload your Multiple Sequence Alignment';
  constructor() { }

  public changeValue(value: number) {
    if (value === 100) {
      this.message = 'Your Multiple Sequence Alignment has been uploaded';
    } else {
      this.message = 'Your Multiple Sequence Alignment is being uploaded';
    }
    this.progress = String(value) + '%';
  }

  public postError(message: String) {
    this.progress = '100%';
    setTimeout(() => {
      this.progress = '';
      this.message = message;
    }, 1000);
    return;
  }

}
