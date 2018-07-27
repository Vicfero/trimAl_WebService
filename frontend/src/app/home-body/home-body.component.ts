import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { debug } from 'util';

@Component({
  selector: 'app-home-body',
  templateUrl: './home-body.component.html',
  styleUrls: ['./home-body.component.css', '../app.component.css']
})

export class HomeBodyComponent implements OnInit {

  URL = 'http://localhost:5000/upload';

  file: File = null;
  // tslint:disable-next-line:no-inferrable-types
  raw_content: string = '';

  uploader: FileUploader = new FileUploader(
  { url: this.URL,
    removeAfterUpload: false,
    autoUpload: false });


  constructor() {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
    };

    this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
    };

    this.uploader.onProgressItem = (item: FileItem, progress: any) => {
      console.log(progress);
    };


  }

  ngOnInit() {
  }

  resetFile(event) {
    this.file = null;
    event.target.form.reset();
  }

  onInput(value) {
    this.file = value.target.files[0];
  }

  onRawInput(value) {
    this.raw_content = value.target.value;
  }

  submit() {
    if (this.file != null) {
      this.uploader.uploadAll();
    } else if (this.raw_content != null) {
      const F = new File([this.raw_content], 'F.fasta');
      this.uploader.addToQueue([F]);
      this.uploader.uploadAll();
    }
  }
}
