import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  public data: any = [];

  uploadedAlignments: any = [];

  SaveInLocal(key, val): void {
    this.storage.set(key, val);
    this.data[key] = this.storage.get(key);
  }

  GetFromLocal(key): void {
    this.data[key] = this.storage.get(key);
  }

  DeleteFromLocal(key): void {
    delete this.data[key];
    this.storage.remove(key);
  }

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private http: HttpClient) {
    this.GetFromLocal('Alignment');
    this.CheckIDexistance();
  }

  public AddUploadedAlignment(id: string): void {
    this.uploadedAlignments[id] = [];
    this.SaveInLocal('alignments', this.uploadedAlignments);
  }

  public AddProcessedAlignment(fromID: string, toID: string, method: string) {
    this.uploadedAlignments[fromID][method] = toID;
    this.SaveInLocal('alignments', this.uploadedAlignments);
  }

  CheckIDexistance(): void {
    const vari = this.http.get(`http://127.0.0.1:5000/exists/` + this.data['Alignment']);
    vari.subscribe(
      (res: any) => {
        if (!res['Exists']) {
          this.DeleteFromLocal('Alignment');
        }
        console.log(res);
      },
      (error: any) => { console.log(error); },
    );
    return;
  }
}
