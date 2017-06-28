import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgxCircularSliderComponent} from './ngx-circular-slider.component';


describe('NgxCircularSliderComponent', () => {
  let component: NgxCircularSliderComponent;
  let fixture: ComponentFixture<NgxCircularSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxCircularSliderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCircularSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
