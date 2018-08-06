import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  uploadedAlignments: any = [];

  expandedAlignments: any = [];

  public lastUploadedAlignmentObservable = new Subject<string>();

  public lastUploadedAlignmentExpanded = '';

  public RemoveUploadedAlignment(id: string): void {
    const index = this.uploadedAlignments.indexOf(id, 0);
    if (index > -1) {
      this.uploadedAlignments.splice(index, 1);
      this.storage.set('alignments', this.uploadedAlignments);
    }
  }

  public AddUploadedAlignment(id: string): void {
    this.uploadedAlignments.push(id);
    this.storage.set('alignments', this.uploadedAlignments);

    this.ExpandAlignment(id, x => { this.lastUploadedAlignmentExpanded = x; this.lastUploadedAlignmentObservable.next(id); });
  }

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private http: HttpClient) {
    this.uploadedAlignments = this.storage.get('alignments');
    this.uploadedAlignments.forEach(element => {
      this.ExpandAlignment(element);
    });
  }

  ExpandAlignment(ID, callback = null): void {
    const vari = this.http.get(`http://127.0.0.1:5000/status/` + ID);
    vari.subscribe(
      (res: any) => {
        if ('Error' in res) {
          this.RemoveUploadedAlignment(ID);
        }
        this.expandedAlignments[ID] = res;
        if (callback != null) { callback(res); }
      },
      // (error: any) => { console.log(error); },
    );
    return;
  }
}
