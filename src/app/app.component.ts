import { Component } from "@angular/core";
import { IOutput, IProps, ISliderStartStopInput } from "ngx-circular-slider";
import moment from "moment-es6";

const SLIDER_PROPS: IProps = {
  gradientColorFrom: "#0081c5",
  gradientColorTo: "#aaddf8",
  segments: 48,
  bgCircleColor: "white"
};

@Component({
  selector: "app-app-component",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public startAndStop: ISliderStartStopInput;
  public sliderProps = SLIDER_PROPS;

  constructor() {
    this.startAndStop = {
      start: new Date().toISOString(),
      stop: new Date().toISOString()
    };
  }

  public handleSliderChange(changes: IOutput) {
    console.log("changes in app ", changes);
  }

  public createRandomValues() {
    console.log("changes in app +1 hour");
    this.startAndStop = {
      ...this.startAndStop,
      stop: moment(this.startAndStop.stop)
        .add(1, "hour")
        .toISOString(true)
    };
  }
}
