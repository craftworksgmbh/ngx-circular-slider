import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxCircularSliderComponent } from "./ngx-cs-slider.component";
import { NgxCircularSliderModule } from "../ngx-circular-slider.module";

describe("NgxCircularSliderComponent", () => {
  let component: NgxCircularSliderComponent;
  let fixture: ComponentFixture<NgxCircularSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxCircularSliderModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCircularSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
