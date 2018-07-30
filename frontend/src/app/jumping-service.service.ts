import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable({
  providedIn: 'root'
})
export class JumpingServiceService {

  constructor(private _scrollToService: ScrollToService) { }

  public triggerScrollTo(destination: string, container?: string) {
    const config: ScrollToConfigOptions = {
      // container: 'Scroller',
      target: destination,
      duration: 1200,
      easing: 'easeInOutCubic',
      offset: 20
    };

    this._scrollToService.scrollTo(config);
  }
}
