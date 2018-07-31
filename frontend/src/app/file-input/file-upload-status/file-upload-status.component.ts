import { Component, OnInit } from '@angular/core';

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

  public changeValue(value: number, customMessage?: String) {

    if (customMessage) {
      this.message = customMessage;
      this.progress = '0%';
      console.log('Error Found');
      return;
    }

    if (value === 0) {
      this.message = 'Upload your Multiple Sequence Alignment';
    } else if (value === 100) {
      this.message = 'Your Multiple Sequence Alignment has been uploaded';
    } else {
      this.message = 'Your Multiple Sequence Alignment is being uploaded';
    }

    this.progress = String(value) + '%';
  }

}
