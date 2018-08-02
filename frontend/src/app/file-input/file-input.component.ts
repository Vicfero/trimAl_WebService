import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, OnChanges, ElementRef, Input } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MainPageComponent } from '../main-page/main-page.component';
import { FileUploadStatusComponent } from './file-upload-status/file-upload-status.component';
import { debug } from 'util';
import { StepperComponent } from '../stepper/stepper.component';
import { CookieService } from 'ng2-cookies';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css', '../app.component.css'],
  providers: [  ]
})

export class FileInputComponent implements OnInit {

  @Input() stepper: StepperComponent;
  @ViewChild(FileUploadStatusComponent) statusComponent;

  @ViewChild('UploadFileForm') UploadFileForm: ElementRef;
  @ViewChild('RawFileTextArea') RawFileTextArea: ElementRef;

  isUploading = false;

  URL = 'http://127.0.0.1:5000/upload';

  file: File = null;
  // tslint:disable-next-line:no-inferrable-types
  raw_content: string = '';

  // ng2-file-uploader
  uploader: FileUploader = new FileUploader(
    { url: this.URL,
      removeAfterUpload: false,
      autoUpload: false
    });

    // Constructor that injects the parent module into the child one
    constructor(public localStorage: TrackerService) {

      // Uploader configuration
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        const res = JSON.parse(response);
        if ('Error' in res) {
          this.statusComponent.postError(res['Error']);
          return;
        }
        setTimeout(() => {
          this.localStorage.SaveInLocal('Alignment', res['ID']);
          this.stepper.next();
          this.resetForm();
        }, 1000);
      };

      this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
        this.statusComponent.changeValue(0, response.error);
      };

      this.uploader.onProgressItem = (item: FileItem, progress: any) => {
        this.statusComponent.changeValue(progress);
      };

    }

    /// Reset File, used by the InputFile
    resetForm() {
      this.file = null;
      this.raw_content = '';
      this.UploadFileForm.nativeElement.reset();
      this.isUploading = false;
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
        this.isUploading = true;
      } else if (this.raw_content != null) {
        const F = new File([this.raw_content], 'raw_input.fasta');
        this.uploader.addToQueue([F]);
        this.uploader.uploadAll();
        this.isUploading = true;
      }
      return false;
    }

    ngOnInit(): void {
      if (('Alignment' in this.localStorage.data) && this.localStorage.data != null) {
        setTimeout(() => {
          this.stepper.next();
        }, 1000);
      }
    }

  }
