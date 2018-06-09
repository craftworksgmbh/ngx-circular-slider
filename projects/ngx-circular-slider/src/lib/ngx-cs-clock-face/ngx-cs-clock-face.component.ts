import { Component, Input, OnChanges } from "@angular/core";

const DEFAULT_RANGE = 48;
const DEFAULT_TIME_RANGE = 12;

export interface IClockLines {
  id: number;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: "[ngx-cs-clock-face]",
  templateUrl: "./ngx-cs-clock-face.component.html",
  styleUrls: ["./ngx-cs-clock-face.component.scss"]
})
export class NgXCSClockFaceComponent implements OnChanges {
  @Input() radius: number;
  @Input() stroke: number;

  public faceRadius: number;
  public textRadius: number;
  public clockLines: IClockLines[];
  public clockTexts: any[];

  constructor() {
    this.clockLines = [];
    this.clockTexts = [];
  }

  ngOnChanges() {
    this.faceRadius = this.radius - 5;
    this.textRadius = this.radius - 26;

    this.createClockLines();
    this.createClockTexts();
  }

  private createClockLines() {
    for (let i = 0; i < DEFAULT_RANGE; i++) {
      const cos = Math.cos(((2 * Math.PI) / DEFAULT_RANGE) * i);
      const sin = Math.sin(((2 * Math.PI) / DEFAULT_RANGE) * i);
      this.clockLines.push({
        id: i,
        strokeWidth: i % 4 === 0 ? 3 : 1,
        x1: cos * this.faceRadius,
        y1: sin * this.faceRadius,
        x2: cos * (this.faceRadius - 7),
        y2: sin * (this.faceRadius - 7)
      });
    }
  }

  private createClockTexts() {
    for (let i = 0; i < DEFAULT_TIME_RANGE; i++) {
      this.clockTexts.push({
        id: i,
        x:
          this.textRadius *
          Math.cos(((2 * Math.PI) / 12) * i - Math.PI / 2 + Math.PI / 6),
        y:
          this.textRadius *
          Math.sin(((2 * Math.PI) / 12) * i - Math.PI / 2 + Math.PI / 6)
      });
    }
  }
}
