import { Component, HostListener, Inject } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { TrackerService } from './tracker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css'],
  providers: [CookieService]
})

export class AppComponent {
  title = 'app';

  constructor(public localStorage: TrackerService) { }

}
