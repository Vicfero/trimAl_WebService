import { Component, HostListener, Inject } from '@angular/core';
import { TrackerService } from './tracker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css'],
  providers: []
})

export class AppComponent {
  title = 'app';

  constructor(public localStorage: TrackerService) { }

}
