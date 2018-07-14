import { SimpleChange, SimpleChanges } from "@angular/core";
import * as moment from "moment";

export interface ISliderChanges extends SimpleChanges {
  props: SimpleChange;
}

export interface ISliderStartStopInput {
  start: string;
  stop: string;
}

export interface IStartStop {
  start: moment.Moment;
  stop: moment.Moment;
}

export interface IOutput {
  start: string;
  stop: string;
}

export interface IProps {
  segments?: number;
  strokeWidth?: number;
  radius?: number;
  gradientColorFrom?: string;
  gradientColorTo?: string;
  bgCircleColor?: string;
  showClockFace?: boolean;
  clockFaceColor?: string;
}

export interface IArc {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  realToX: number;
  realToY: number;
}

export interface IColor {
  fromColor: string;
  toColor: string;
}

export interface ICoords {
  x: number;
  y: number;
}

export interface ISegment {
  id: number;
  d: string;
  colors: IColor;
  arcs: IArc;
}
