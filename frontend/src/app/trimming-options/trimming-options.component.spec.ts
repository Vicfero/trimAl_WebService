import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimmingOptionsComponent } from './trimming-options.component';

describe('TrimmingOptionsComponent', () => {
  let component: TrimmingOptionsComponent;
  let fixture: ComponentFixture<TrimmingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrimmingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrimmingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
