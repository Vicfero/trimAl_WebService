import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CeleryTrimTaskWrapperComponent } from './celery-trim-task-wrapper.component';

describe('CeleryTrimTaskWrapperComponent', () => {
  let component: CeleryTrimTaskWrapperComponent;
  let fixture: ComponentFixture<CeleryTrimTaskWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CeleryTrimTaskWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CeleryTrimTaskWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
