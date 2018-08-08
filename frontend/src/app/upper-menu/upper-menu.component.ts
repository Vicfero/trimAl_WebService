import { Component, OnInit } from '@angular/core';
import { routes, endpoints } from '../app-routing.module';

@Component({
  selector: 'app-upper-menu',
  templateUrl: './upper-menu.component.html',
  styleUrls: ['./upper-menu.component.css']
})
export class UpperMenuComponent implements OnInit {

  routes = routes;
  endpoints = endpoints;

  constructor() { }

  ngOnInit() {
  }

}
