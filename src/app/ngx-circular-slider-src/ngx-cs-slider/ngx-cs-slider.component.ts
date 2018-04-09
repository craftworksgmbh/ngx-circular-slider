import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/do';
import { Subscription } from 'rxjs/Subscription';
import { interpolateHcl } from 'd3-interpolate';
import { IArc, IColor, ICoords, IOutput, IProps, ISegment, ISliderChanges } from '../interfaces';

const THROTTLE_DEFAULT = 50;
const DEFAULT_PROPS: IProps = {
  segments: 6,
  strokeWidth: 40,
  radius: 145,
  gradientColorFrom: '#ff9800',
  gradientColorTo: '#ffcf00',
  bgCircleColor: '#171717',
  showClockFace: true,
  clockFaceColor: '#9d9d9d'
};


@Component({
  selector: 'ngx-cs-slider',
  templateUrl: './ngx-cs-slider.component.html',
  styleUrls: ['./ngx-cs-slider.component.scss']
})
export class NgxCircularSliderComponent implements OnChanges, OnInit, OnDestroy {
  @Input() props: IProps;
  @Input() startAngle: number;
  @Input() angleLength: number;
  @Output() update: EventEmitter<IOutput> = new EventEmitter<IOutput>();
  public segments: ISegment[];
  public start: IArc;
  public stop: IArc;
  private startSubscription: Subscription;
  private stopSubscription: Subscription;
  private circleCenterX: number;
  private circleCenterY: number;
  @ViewChild('circle')
  private circle: ElementRef;
  @ViewChild('stopIcon')
  private stopIcon: ElementRef;
  @ViewChild('startIcon')
  private startIcon: ElementRef;

  private static extractMouseEventCoords(evt: MouseEvent | TouchEvent) {
    const coords: ICoords = (evt instanceof MouseEvent ? {
      x: evt.clientX,
      y: evt.clientY
    } : { x: evt.changedTouches.item(0).clientX, y: evt.changedTouches.item(0).clientY });
    return coords;
  }

  constructor() {
    this.props = DEFAULT_PROPS;
    this.startAngle = 0;
    this.angleLength = 0;
  }

  ngOnInit() {
    this.setCircleCenter();
    this.onUpdate();
    this.setObservables();
  }

  ngOnChanges(changes: ISliderChanges) {
    if (changes.props) {
      this.props = (changes.props.firstChange ? Object.assign(DEFAULT_PROPS, changes.props.currentValue) : DEFAULT_PROPS);
    }
  }

  ngOnDestroy() {
    this.closeStreams();
  }

  private onUpdate() {
    this.calcStartAndStop();
    this.createSegments();
    this.update.emit({ startAngle: this.startAngle, angleLength: this.angleLength });
  }

  private setObservables() {
    const mouseMove$ = Observable.merge(
      Observable.fromEvent(document, 'mousemove'),
      Observable.fromEvent(document, 'touchmove')
    );
    const mouseUp$ = Observable.merge(
      Observable.fromEvent(document, 'mouseup'),
      Observable.fromEvent(document, 'touchend')
    );

    this.startSubscription = Observable.merge(
      Observable.fromEvent(this.startIcon.nativeElement, 'touchstart'),
      Observable.fromEvent(this.startIcon.nativeElement, 'mousedown')
    ).switchMapTo(mouseMove$
      .takeUntil(mouseUp$))
      .throttleTime(THROTTLE_DEFAULT)
      .subscribe((res: MouseEvent | TouchEvent) => {
        this.handleStartPan(res);
      });

    this.stopSubscription = Observable.merge(
      Observable.fromEvent(this.stopIcon.nativeElement, 'touchstart'),
      Observable.fromEvent(this.stopIcon.nativeElement, 'mousedown')
    ).switchMapTo(mouseMove$
      .takeUntil(mouseUp$))
      .throttleTime(THROTTLE_DEFAULT)
      .subscribe((res: MouseEvent | TouchEvent) => {
        this.handleStopPan(res);
      });


  }

  private closeStreams() {
    this.startSubscription.unsubscribe();
    this.stopSubscription.unsubscribe();
    this.startSubscription = null;
    this.stopSubscription = null;
  }

  private handleStartPan(evt: MouseEvent | TouchEvent) {
    const coords = NgxCircularSliderComponent.extractMouseEventCoords(evt);

    this.setCircleCenter();
    const currentAngleStop = (this.startAngle + this.angleLength) % (2 * Math.PI);
    let newAngle = Math.atan2(coords.y - this.circleCenterY, coords.x - this.circleCenterX) + Math.PI / 2;

    if (newAngle < 0) {
      newAngle += 2 * Math.PI;
    }

    let newAngleLength = currentAngleStop - newAngle;
    if (newAngleLength < 0) {
      newAngleLength += 2 * Math.PI;
    }

    this.startAngle = newAngle;
    this.angleLength = newAngleLength % (2 * Math.PI);

    this.onUpdate();
  }

  private handleStopPan(evt: MouseEvent | TouchEvent) {
    const coords = NgxCircularSliderComponent.extractMouseEventCoords(evt);
    this.setCircleCenter();
    const newAngle = Math.atan2(coords.y - this.circleCenterY, coords.x - this.circleCenterX) + Math.PI / 2;
    let newAngleLength = (newAngle - this.startAngle) % (2 * Math.PI);

    if (newAngleLength < 0) {
      newAngleLength += 2 * Math.PI;
    }

    this.angleLength = newAngleLength;
    this.onUpdate();
  }

  private calcStartAndStop() {
    this.start = this.calculateArcCircle(0, this.props.segments, this.props.radius,
      this.startAngle, this.angleLength);
    this.stop = this.calculateArcCircle(this.props.segments - 1, this.props.segments,
      this.props.radius, this.startAngle, this.angleLength);
  }

  private calculateArcColor(index, segments, gradientColorFrom, gradientColorTo) {
    const interpolate = interpolateHcl(gradientColorFrom, gradientColorTo);

    return {
      fromColor: interpolate(index / segments),
      toColor: interpolate((index + 1) / segments),
    };
  }

  private calculateArcCircle(indexInput, segments, radius, startAngleInput = 0, angleLengthInput = 2 * Math.PI) {
    // Add 0.0001 to the possible angle so when start = stop angle, whole circle is drawn
    const startAngle = startAngleInput % (2 * Math.PI);
    const angleLength = angleLengthInput % (2 * Math.PI);
    const index = indexInput + 1;
    const fromAngle = angleLength / segments * (index - 1) + startAngle;
    const toAngle = angleLength / segments * index + startAngle;
    const fromX = radius * Math.sin(fromAngle);
    const fromY = -radius * Math.cos(fromAngle);
    const realToX = radius * Math.sin(toAngle);
    const realToY = -radius * Math.cos(toAngle);

    // add 0.005 to start drawing a little bit earlier so segments stick together
    const toX = radius * Math.sin(toAngle + 0.005);
    const toY = -radius * Math.cos(toAngle + 0.005);

    return {
      fromX,
      fromY,
      toX,
      toY,
      realToX,
      realToY
    };
  }

  private createSegments() {
    this.segments = [];
    for (let i = 0; i < this.props.segments; i++) {
      const id = i;
      const colors: IColor = this.calculateArcColor(id, this.props.segments, this.props.gradientColorFrom, this.props.gradientColorTo);
      const arcs: IArc = this.calculateArcCircle(id, this.props.segments, this.props.radius, this.startAngle, this.angleLength);

      this.segments.push({
        id: id,
        d: `M ${arcs.fromX.toFixed(2)} ${arcs.fromY.toFixed(2)} A ${this.props.radius} ${this.props.radius} 
        0 0 1 ${arcs.toX.toFixed(2)} ${arcs.toY.toFixed(2)}`,
        colors: Object.assign({}, colors),
        arcs: Object.assign({}, arcs)
      });
    }
  }

  private setCircleCenter() {
    // todo: nicer solution to use document.body?
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = this.circle.nativeElement.getBoundingClientRect();
    const px = elemRect.left - bodyRect.left;
    const py = elemRect.top - bodyRect.top;
    const halfOfContainer = this.getContainerWidth() / 2;
    this.circleCenterX = px + halfOfContainer;
    this.circleCenterY = py + halfOfContainer;
  }

  public getContainerWidth() {
    const { strokeWidth, radius } = this.props;
    return strokeWidth + radius * 2 + 2;
  }

  public getGradientId(index) {
    return `gradient${index}`;
  }

  public getGradientUrl(index) {
    return `url(#gradient${index})`;
  }

  public getTranslate(): string {
    return ` translate(
  ${this.props.strokeWidth / 2 + this.props.radius + 1},
  ${this.props.strokeWidth / 2 + this.props.radius + 1} )`;
  }

  public getTranslateFrom(x, y): string {
    return ` translate(${x}, ${y})`;
  }

}
