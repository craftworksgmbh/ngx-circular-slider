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
} from "@angular/core";
import { fromEvent, merge } from "rxjs";
import {
  IArc,
  ICoords,
  IOutput,
  IProps,
  ISegment,
  ISliderChanges,
  ISliderStartStopInput
} from "../interfaces";
import { switchMap, takeUntil, throttleTime } from "rxjs/operators";
import { untilDestroyed } from "ngx-take-until-destroy";
import { NgxCalculationService } from "../services/ngx-calculation.service";

const THROTTLE_DEFAULT = 50;
const DEFAULT_PROPS: IProps = {
  segments: 6,
  strokeWidth: 40,
  radius: 145,
  gradientColorFrom: "#ff9800",
  gradientColorTo: "#ffcf00",
  bgCircleColor: "#171717",
  showClockFace: true,
  clockFaceColor: "#9d9d9d"
};

@Component({
  selector: "ngx-cs-slider",
  templateUrl: "./ngx-cs-slider.component.html",
  styleUrls: ["./ngx-cs-slider.component.scss"],
  viewProviders: [NgxCalculationService]
})
export class NgxCircularSliderComponent
  implements OnChanges, OnInit, OnDestroy {
  @Input()
  props: IProps;
  @Input()
  startAndStop: ISliderStartStopInput;
  @Output()
  update: EventEmitter<IOutput> = new EventEmitter<IOutput>();
  public segments: ISegment[];
  public start: IArc;
  public stop: IArc;
  public containerSideLength: number;
  private circleCenterX: number;
  private circleCenterY: number;
  @ViewChild("circle")
  private circle: ElementRef;
  @ViewChild("stopIcon")
  private stopIcon: ElementRef;
  @ViewChild("startIcon")
  private startIcon: ElementRef;

  constructor(private calcFacade: NgxCalculationService) {
    this.props = DEFAULT_PROPS;
  }

  ngOnInit() {
    this.setCircleCenter();
    this.onUpdate();
    this.setSlideObservables();
  }

  ngOnChanges(changes: ISliderChanges) {
    if (changes.props && changes.props.currentValue) {
      this.props = Object.assign(DEFAULT_PROPS, changes.props.currentValue);
      this.calcFacade.props = this.props;
    }
    this.onUpdate();
  }

  private setCircleCenter() {
    const [xCenter, yCenter] = this.calcFacade.setCircleCenter(
      this.circle.nativeElement
    );
    this.circleCenterX = xCenter;
    this.circleCenterY = yCenter;
    this.containerSideLength = this.calcFacade.getContainerSideLength();
  }

  private onUpdate() {
    const startAngle = this.getStartAngle();
    const angleLength = this.getAngleLength(startAngle);
    const { start, stop } = this.calcFacade.calcStartAndStop();
    this.start = start;
    this.stop = stop;
    this.segments = this.calcFacade.createSegments();
    // todo: emit output of date-strings
    // this.update.emit({
    // });
  }

  private setSlideObservables() {
    const mouseMove$ = merge(
      fromEvent(document, "mousemove"),
      fromEvent(document, "touchmove")
    );
    const mouseUp$ = merge(
      fromEvent(document, "mouseup"),
      fromEvent(document, "touchend")
    );

    merge(
      fromEvent(this.startIcon.nativeElement, "touchstart"),
      fromEvent(this.startIcon.nativeElement, "mousedown")
    )
      .pipe(
        switchMap(_ =>
          mouseMove$.pipe(
            takeUntil(mouseUp$),
            throttleTime(THROTTLE_DEFAULT)
          )
        ),
        untilDestroyed(this)
      )
      .subscribe((res: MouseEvent | TouchEvent) => {
        this.handleMovePan(res);
      });

    // merge(
    //   fromEvent(this.stopIcon.nativeElement, 'touchstart'),
    //   fromEvent(this.stopIcon.nativeElement, 'mousedown')
    // ).pipe(
    //   switchMap(_ => mouseMove$.pipe(
    //     takeUntil(mouseUp$),
    //     throttleTime(THROTTLE_DEFAULT)
    //   )),
    //   untilDestroyed(this)
    // ).subscribe((res: MouseEvent | TouchEvent) => {
    //   this.handleStopPan(res);
    // });
  }

  private handleMovePan(evt: MouseEvent | TouchEvent) {
    const coords: ICoords = NgxCalculationService.extractMouseEventCoords(evt);
    this.setCircleCenter();
    const currentAngleStop =
      (this.startAngle + this.angleLength) % (2 * Math.PI);
    let newAngle =
      Math.atan2(coords.y - this.circleCenterY, coords.x - this.circleCenterX) +
      Math.PI / 2;

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

  // private handleStopPan(evt: MouseEvent | TouchEvent) {
  //   const coords = NgxCircularSliderComponent.extractMouseEventCoords(evt);
  //   this.setCircleCenter();
  //   const newAngle = Math.atan2(coords.y - this.circleCenterY, coords.x - this.circleCenterX) + Math.PI / 2;
  //   let newAngleLength = (newAngle - this.startAngle) % (2 * Math.PI);
  //
  //   if (newAngleLength < 0) {
  //     newAngleLength += 2 * Math.PI;
  //   }
  //
  //   this.angleLength = newAngleLength;
  //   this.onUpdate();
  // }

  public getGradientId(index) {
    return `gradient${index}`;
  }

  public getGradientUrl(index) {
    return `url(#gradient${index})`;
  }

  public getTranslateFrom(x, y): string {
    return ` translate(${x}, ${y})`;
  }

  public getTranslate(): string {
    return this.calcFacade.getTranslate();
  }
}
