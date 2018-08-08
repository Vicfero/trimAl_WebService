import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadalResultComponent } from './readal-result.component';

describe('ReadalResultComponent', () => {
  let component: ReadalResultComponent;
  let fixture: ComponentFixture<ReadalResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadalResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
