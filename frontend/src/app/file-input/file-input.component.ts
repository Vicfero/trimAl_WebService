import { Component, OnInit, Inject } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MainPageComponent } from '../main-page/main-page.component';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css', '../app.component.css']
})

export class FileInputComponent {

  URL = 'http://localhost:5000/upload';

  file: File = null;
  // tslint:disable-next-line:no-inferrable-types
  raw_content: string = '';

  // ng2-file-uploader
  uploader: FileUploader = new FileUploader(
  { url: this.URL,
    removeAfterUpload: false,
    autoUpload: false });

  // Constructor that injects the parent module into the child one
  constructor(@Inject(MainPageComponent) private parent: MainPageComponent) {

    // Uploader configuration
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

  /// Reset File, used by the InputFile
  resetFile(event) {
    this.file = null;
    event.target.form.reset();
  }

  /// Save the input file
  onInput(value) {
    this.file = value.target.files[0];
  }

  /// Save the input raw content
  onRawInput(value) {
    this.raw_content = value.target.value;
  }

  /// Submit the MSA (raw or file)
  submit() {
    if (this.file != null) {
      this.uploader.uploadAll();
    } else if (this.raw_content != null) {
      const F = new File([this.raw_content], 'raw_input.fasta');
      this.uploader.addToQueue([F]);
      this.uploader.uploadAll();
    }
  }
}
