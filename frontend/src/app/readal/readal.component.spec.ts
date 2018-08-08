import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadalComponent } from './readal.component';

describe('ReadalComponent', () => {
  let component: ReadalComponent;
  let fixture: ComponentFixture<ReadalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
