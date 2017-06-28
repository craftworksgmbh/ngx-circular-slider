import {Component} from '@angular/core';
import {IOutput, IProps} from './ngx-circular-slider-src/interfaces';

const SLIDER_PROPS: IProps = {
  gradientColorFrom: '#0081c5',
  gradientColorTo: '#aaddf8',
  segments: 24,
  bgCircleColor: 'white'
};

@Component({
  selector: 'ngx-cs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public startDate: Date;
  public endDate: Date;
  public start = 0;
  public length = 0;
  public sliderProps = SLIDER_PROPS;

  constructor() {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  public handleSliderChange(changes: IOutput) {
    console.info('changes in app ', changes);
  }

  public createRandomValues() {
    this.length += 0.33;
  }

  // todo: functions are for using it (demo)
  private calculateMinutesFromAngle(angle) {
    return Math.round(angle / (2 * Math.PI / (12 * 12))) * 5;
  }

  private calculateTimeFromAngle(angle) {
    const minutes = this.calculateMinutesFromAngle(angle);
    const h = Math.floor(minutes / 60);
    const m = minutes - h * 60;

    return {h, m};
  }

  private roundAngleToFives(angle) {
    const fiveMinuteAngle = 2 * Math.PI / 144;

    return Math.round(angle / fiveMinuteAngle) * fiveMinuteAngle;
  }

  private padMinutes(min) {
    if (`${min}`.length < 2) {
      return `0${min}`;
    }

    return min;
  }
}
