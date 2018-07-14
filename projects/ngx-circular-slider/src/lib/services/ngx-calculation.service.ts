import {
  EventEmitter,
  Injectable,
  Input,
  Output,
  SimpleChange,
  SimpleChanges
} from "@angular/core";
import { ISliderStartStopInput } from "../interfaces";
import * as moment from "moment";

const HOURS_HALF_DAY = 12;
const HOURS_FULL_DAY = 24;
const FULL_MINUTES_FOR_CLOCK = 1440 / (HOURS_FULL_DAY / HOURS_HALF_DAY); // 1440 minutes of a complete day divided by 2 because the clock shows only 0 - 12
const MINUTES_PER_DEGREE = FULL_MINUTES_FOR_CLOCK / 360;
const MINUTES_TIME_INTERVAL = 5;

interface InputChanges extends SimpleChanges {
  datesInput: SimpleChange;
}

@Injectable({
  providedIn: "root"
})
export class NgxCalculationService {
  public start: number;
  public length: number;
  // indicates if it's AM or PM
  private pm: boolean;

  /**
   * do the calculation from a moment date to a radian number for the position of the circular slider
   * @param {moment.Moment} date
   * @returns {number}
   */
  private calculateRadianFromTime(date: moment.Moment = moment()): number {
    const minutesSinceDayStart = this.getMinutesSinceDayStart(date);
    const minutesForClockFace = minutesSinceDayStart % FULL_MINUTES_FOR_CLOCK;
    const timeInDegrees = this.minutesToDegree(minutesForClockFace);

    return this.degreesToRadian(timeInDegrees);
  }

  private degreesToRadian(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  private degreeToMinutes(degree: number): number {
    return degree * MINUTES_PER_DEGREE;
  }

  private minutesToDegree(minutes: number): number {
    return minutes / MINUTES_PER_DEGREE;
  }

  private getMinutesSinceDayStart(date: moment.Moment): number {
    const startOfTheDay = date.clone().startOf("date");
    return date.diff(startOfTheDay, "minutes", true);
  }

  public correctDates(dates: ISliderStartStopInput): ISliderStartStopInput {
    if (!dates.start && !dates.stop) {
      return { start: moment(), stop: moment().add(8, "hours") };
    }
    if (dates.start && !dates.stop) {
      return { start: dates.start.clone(), stop: moment() };
    }
    if (dates.start && dates.stop) {
      return { start: dates.start.clone(), stop: dates.stop.clone() };
    }
  }

  private calculateAngleLengthFromTwoRadians(
    start: number,
    stop: number
  ): number {
    const startDegree = this.radiansToDegrees(start);
    const stopDegree = this.radiansToDegrees(stop);
    const alpha = this.calculateAlphaFromTwoDegrees(startDegree, stopDegree);
    return (alpha / 360) * 2 * Math.PI;
  }

  private calculateAlphaFromTwoDegrees(
    startDegree: number,
    stopDegree: number
  ): number {
    return 360 - (startDegree - stopDegree);
  }

  private calculateAlphaFromRadianToDegree(angleLength: number): number {
    return (angleLength * 360) / (2 * Math.PI);
  }

  private createRoundedDatesSinceMidnight(minutes: number): moment.Moment {
    const roundedMinutes =
      (minutes / MINUTES_TIME_INTERVAL) * MINUTES_TIME_INTERVAL +
      MINUTES_TIME_INTERVAL;
    return moment()
      .startOf("day")
      .add(roundedMinutes, "minutes")
      .set("seconds", 0)
      .set("milliseconds", 0);
  }

  constructor() {}

  ngOnChanges(changes: InputChanges) {
    const dates = changes.datesInput;
    if (
      dates &&
      dates.currentValue &&
      dates.currentValue !== dates.previousValue
    ) {
      [this.start, this.length] = [
        ...this.handleInputDates(dates.currentValue)
      ];
    }
  }

  private handleInputDates(
    correctedDates: ISliderStartStopInput
  ): [number, number] {
    const startRad = this.calculateRadianFromTime(correctedDates.start);
    const stopRad = this.calculateRadianFromTime(correctedDates.stop);
    const angleLength = this.calculateAngleLengthFromTwoRadians(
      startRad,
      stopRad
    );
    this.pm = correctedDates.start.get("hours") >= HOURS_HALF_DAY;

    return [startRad, angleLength];
  }

  public handleSliderChange(change: IOutput) {
    const startRadian = change.startAngle;
    const angleLength = change.angleLength;
    const startDegree = this.radiansToDegrees(startRadian);
    const alpha = this.calculateAlphaFromRadianToDegree(angleLength);
    const stopDegree = startDegree + alpha;

    const startAndStop = this.calculateTimeFromDegrees(startDegree, stopDegree);
    this.onTimeChange.emit(startAndStop);
  }

  private calculateTimeFromDegrees(
    startDegrees: number,
    stopDegrees: number
  ): ISliderStartStopInput {
    const startMinutes =
      this.degreeToMinutes(startDegrees) +
      (this.pm ? FULL_MINUTES_FOR_CLOCK : 0);
    const stopMinutes =
      this.degreeToMinutes(stopDegrees) +
      (this.pm ? FULL_MINUTES_FOR_CLOCK : 0);
    // if the value goes over midnight add half day in minutes
    const additionalStopMinutes =
      startMinutes > stopMinutes ? FULL_MINUTES_FOR_CLOCK : 0;

    return {
      start: this.createRoundedDatesSinceMidnight(startMinutes),
      stop: this.createRoundedDatesSinceMidnight(
        stopMinutes + additionalStopMinutes
      )
    };
  }
}
