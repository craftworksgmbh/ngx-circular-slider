import { Component } from "@angular/core";
import { IOutput, IProps } from "ngx-circular-slider";
import * as moment from "moment";

const SLIDER_PROPS: IProps = {
  gradientColorFrom: "#0081c5",
  gradientColorTo: "#aaddf8",
  segments: 48,
  bgCircleColor: "white"
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public startDate: Date;
  public endDate: Date;
  public sliderProps = SLIDER_PROPS;

  constructor() {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  public handleSliderChange(changes: IOutput) {
    console.log("changes in app ", changes);
  }

  public createRandomValues() {
    console.log("changes in app randomo");
    this.endDate = moment(this.endDate)
      .add(1, "hour")
      .toDate();
  }
}
