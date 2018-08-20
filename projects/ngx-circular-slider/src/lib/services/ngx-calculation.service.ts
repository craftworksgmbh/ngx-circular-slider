import { Injectable } from "@angular/core";
import { ISliderStartStopInput, IStartStop } from "../interfaces";
import moment from "moment-es6";

const HOURS_HALF_DAY = 12;
const HOURS_FULL_DAY = 24;
const FULL_MINUTES_FOR_CLOCK = 1440 / (HOURS_FULL_DAY / HOURS_HALF_DAY); // 1440 minutes of a complete day divided by 2 because the clock shows only 0 - 12
const MINUTES_PER_DEGREE = FULL_MINUTES_FOR_CLOCK / 360;
const MINUTES_TIME_INTERVAL = 5;

@Injectable({
  providedIn: "root"
})
export class NgxCalculationService {
  // indicates if it's AM or PM
  private static pm = false;

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
}
