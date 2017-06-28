import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgXCSClockFaceComponent } from './clock-face.component';

describe('NgXCSClockFaceComponent', () => {
  let component: NgXCSClockFaceComponent;
  let fixture: ComponentFixture<NgXCSClockFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgXCSClockFaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgXCSClockFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
