import { Component, OnInit, Input } from '@angular/core';
import { TrackerService } from '../../tracker.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @Input() method: string = null;
  @Input() id: string = null;

  constructor(public localStorage: TrackerService) {

   }

  ngOnInit() {
  }

}
