import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NgXCSClockFaceComponent} from './ngx-cs-clock-face.component';
import {NgxCircularSliderModule} from '../ngx-circular-slider.module';

describe('NgXCSClockFaceComponent', () => {
  let component: NgXCSClockFaceComponent;
  let fixture: ComponentFixture<NgXCSClockFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxCircularSliderModule
      ]
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
