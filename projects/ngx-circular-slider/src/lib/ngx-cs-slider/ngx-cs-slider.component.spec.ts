import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxCircularSliderComponent } from "./ngx-cs-slider.component";
import { NgxCircularSliderModule } from "../ngx-circular-slider.module";
import { IOutput } from "../interfaces";

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

  it("should return the same date after onInit() which was input", async(() => {
    const start = new Date().toISOString();
    const stop = new Date().toISOString();
    let retStartDate: string;
    let retStopDate: string;

    component.update.subscribe((output: IOutput) => {
      retStartDate = output.start;
      retStopDate = output.stop;
    });
    component.startAndStop = { start, stop };
    fixture.detectChanges();

    expect(retStartDate).toBe(start);
    expect(retStopDate).toBe(stop);
  }));
});
