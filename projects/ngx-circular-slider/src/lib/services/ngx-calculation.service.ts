import { Injectable } from "@angular/core";
import {
  IArc,
  IColor,
  ICoords,
  IProps,
  ISegment,
  ISliderStartStopInput,
  IStartStop
} from "../interfaces";
import moment from "moment-es6";
import { interpolateHcl } from "d3-interpolate";

const HOURS_HALF_DAY = 12;
const HOURS_FULL_DAY = 24;
const FULL_MINUTES_FOR_CLOCK = 1440 / (HOURS_FULL_DAY / HOURS_HALF_DAY); // 1440 minutes of a complete day divided by 2 because the clock shows only 0 - 12
const MINUTES_PER_DEGREE = FULL_MINUTES_FOR_CLOCK / 360;
const MINUTES_TIME_INTERVAL = 5;

@Injectable({
  providedIn: "root"
})
export class NgxCalculationService {
  get props(): IProps {
    return { ...this.componentProps };
  }

  set props(props: IProps) {
    this.componentProps = { ...props };
  }

  private componentProps: IProps;
  private pm = false;
  private startAngle: number;
  private angleLength: number;

  // indicates if it's AM or PM

  /**
   * do the calculation from a moment date to a radian number for the position of the circular slider
   * @param  date
   * @returns
   */
  private static calculateRadianFromTime(
    date: moment.Moment = moment()
  ): number {
    const minutesSinceDayStart = NgxCalculationService.getMinutesSinceDayStart(
      date
    );
    const minutesForClockFace = minutesSinceDayStart % FULL_MINUTES_FOR_CLOCK;
    const timeInDegrees = NgxCalculationService.minutesToDegree(
      minutesForClockFace
    );

    return NgxCalculationService.degreesToRadian(timeInDegrees);
  }

  private static extractMouseEventCoords(evt: MouseEvent | TouchEvent) {
    const coords: ICoords =
      evt instanceof MouseEvent
        ? {
            x: evt.clientX,
            y: evt.clientY
          }
        : {
            x: evt.changedTouches.item(0).clientX,
            y: evt.changedTouches.item(0).clientY
          };
    return coords;
  }

  private static degreesToRadian(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  private static degreeToMinutes(degree: number): number {
    return degree * MINUTES_PER_DEGREE;
  }

  private static minutesToDegree(minutes: number): number {
    return minutes / MINUTES_PER_DEGREE;
  }

  private static getMinutesSinceDayStart(date: moment.Moment): number {
    const startOfTheDay = date.clone().startOf("date");
    return date.diff(startOfTheDay, "minutes", true);
  }

  public static correctDates(dates: ISliderStartStopInput): IStartStop {
    const start = moment(dates.start);
    const stop = moment(dates.stop);
    if (!start && !stop) {
      return { start: moment(), stop: moment().add(8, "hours") };
    }
    if (start && !stop) {
      return { start: start.clone(), stop: moment() };
    }
    if (start && stop) {
      return { start: start.clone(), stop: stop.clone() };
    }
  }

  /*
  private static calculateAngleLengthFromTwoRadians(
    start: number,
    stop: number
  ): number {
    const startDegree = this.radiansToDegrees(start);
    const stopDegree = this.radiansToDegrees(stop);
    const alpha = this.calculateAlphaFromTwoDegrees(startDegree, stopDegree);
    return (alpha / 360) * 2 * Math.PI;
  }
*/
  // private static calculateAlphaFromTwoDegrees(
  //   startDegree: number,
  //   stopDegree: number
  // ): number {
  //   return 360 - (startDegree - stopDegree);
  // }
  //
  // private static calculateAlphaFromRadianToDegree(angleLength: number): number {
  //   return (angleLength * 360) / (2 * Math.PI);
  // }
  //
  // private static createRoundedDatesSinceMidnight(
  //   minutes: number
  // ): moment.Moment {
  //   const roundedMinutes =
  //     (minutes / MINUTES_TIME_INTERVAL) * MINUTES_TIME_INTERVAL +
  //     MINUTES_TIME_INTERVAL;
  //   return moment()
  //     .startOf("day")
  //     .add(roundedMinutes, "minutes")
  //     .set("seconds", 0)
  //     .set("milliseconds", 0);
  // }
  //
  // // ngOnChanges(changes: InputChanges) {
  // //   const dates = changes.datesInput;
  // //   if (
  // //     dates &&
  // //     dates.currentValue &&
  // //     dates.currentValue !== dates.previousValue
  // //   ) {
  // //     [this.start, this.length] = [
  // //       ...this.handleInputDates(dates.currentValue)
  // //     ];
  // //   }
  // // }
  //
  // private static handleInputDates(
  //   correctedDates: IStartStop
  // ): [number, number] {
  //   const startRad = NgxCalculationService.calculateRadianFromTime(
  //     correctedDates.start
  //   );
  //   const stopRad = NgxCalculationService.calculateRadianFromTime(
  //     correctedDates.stop
  //   );
  //   const angleLength = NgxCalculationService.calculateAngleLengthFromTwoRadians(
  //     startRad,
  //     stopRad
  //   );
  //   NgxCalculationService.pm =
  //     correctedDates.start.get("hours") >= HOURS_HALF_DAY;
  //
  //   return [startRad, angleLength];
  // }
  //
  // public static handleSliderChange(change: IOutput) {
  //   const startRadian = change.startAngle;
  //   const angleLength = change.angleLength;
  //   const startDegree = this.radiansToDegrees(startRadian);
  //   const alpha = NgxCalculationService.calculateAlphaFromRadianToDegree(
  //     angleLength
  //   );
  //   const stopDegree = startDegree + alpha;
  //
  //   const startAndStop = NgxCalculationService.calculateTimeFromDegrees(
  //     startDegree,
  //     stopDegree
  //   );
  //   // NgxCalculationService.onTimeChange.emit(startAndStop);
  // }
  //
  // private static calculateTimeFromDegrees(
  //   startDegrees: number,
  //   stopDegrees: number
  // ): ISliderStartStopInput {
  //   const startMinutes =
  //     this.degreeToMinutes(startDegrees) +
  //     (NgxCalculationService.pm ? FULL_MINUTES_FOR_CLOCK : 0);
  //   const stopMinutes =
  //     NgxCalculationService.degreeToMinutes(stopDegrees) +
  //     (NgxCalculationService.pm ? FULL_MINUTES_FOR_CLOCK : 0);
  //   // if the value goes over midnight add half day in minutes
  //   const additionalStopMinutes =
  //     startMinutes > stopMinutes ? FULL_MINUTES_FOR_CLOCK : 0;
  //
  //   return {
  //     start: NgxCalculationService.createRoundedDatesSinceMidnight(
  //       startMinutes
  //     ),
  //     stop: NgxCalculationService.createRoundedDatesSinceMidnight(
  //       stopMinutes + additionalStopMinutes
  //     )
  //   };
  // }

  public static calculateArcColor(
    index,
    segments,
    gradientColorFrom,
    gradientColorTo
  ) {
    const interpolate = interpolateHcl(gradientColorFrom, gradientColorTo);

    return {
      fromColor: interpolate(index / segments),
      toColor: interpolate((index + 1) / segments)
    };
  }

  private calculateArcCircle(
    indexInput,
    segments,
    radius,
    startAngleInput = 0,
    angleLengthInput = 2 * Math.PI
  ): IArc {
    // Add 0.0001 to the possible angle so when start = stop angle, whole circle is drawn
    const startAngle = startAngleInput % (2 * Math.PI);
    const angleLength = angleLengthInput % (2 * Math.PI);
    const index = indexInput + 1;
    const fromAngle = (angleLength / segments) * (index - 1) + startAngle;
    const toAngle = (angleLength / segments) * index + startAngle;
    const fromX = radius * Math.sin(fromAngle);
    const fromY = -radius * Math.cos(fromAngle);

    // add 0.005 to start drawing a little bit earlier so segments stick together
    const toX = radius * Math.sin(toAngle + 0.005);
    const toY = -radius * Math.cos(toAngle + 0.005);

    return {
      fromX,
      fromY,
      toX,
      toY
    };
  }

  public setCircleCenter(circleNativeElement: Element): [number, number] {
    // todo: nicer solution to use document.body?
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = circleNativeElement.getBoundingClientRect();
    const px = elemRect.left - bodyRect.left;
    const py = elemRect.top - bodyRect.top;
    const halfOfContainer = this.getContainerWidth() / 2;

    return [px + halfOfContainer, py + halfOfContainer];
  }

  public createSegments(): ISegment[] {
    const segments: ISegment[] = [];
    for (let i = 0; i < this.props.segments; i++) {
      const id = i;
      const colors: IColor = this.calculateArcColor(
        id,
        this.props.segments,
        this.props.gradientColorFrom,
        this.props.gradientColorTo
      );
      const arcs: IArc = this.calculateArcCircle(
        id,
        this.props.segments,
        this.props.radius,
        this.startAngle,
        this.angleLength
      );

      segments.push({
        id: id,
        d: `M ${arcs.fromX.toFixed(2)} ${arcs.fromY.toFixed(2)} A ${
          this.props.radius
        } ${this.props.radius} 
        0 0 1 ${arcs.toX.toFixed(2)} ${arcs.toY.toFixed(2)}`,
        colors: Object.assign({}, colors),
        arcs: Object.assign({}, arcs)
      });
    }
    return segments;
  }

  public getTranslate(): string {
    return ` translate(
  ${this.props.strokeWidth / 2 + this.props.radius + 1},
  ${this.props.strokeWidth / 2 + this.props.radius + 1} )`;
  }

  public getContainerSideLength(): number {
    const { strokeWidth, radius } = this.props;
    return strokeWidth + radius * 2 + 2;
  }

  public calcStartAndStop(
    startAngle: number,
    angleLength: number
  ): { start: IArc; stop: IArc } {
    return {
      start: NgxCalculationService.calculateArcCircle(
        0,
        this.props.segments,
        this.props.radius,
        startAngle,
        angleLength
      ),
      stop: NgxCalculationService.calculateArcCircle(
        this.props.segments - 1,
        this.props.segments,
        this.props.radius,
        startAngle,
        angleLength
      )
    };
  }
}
