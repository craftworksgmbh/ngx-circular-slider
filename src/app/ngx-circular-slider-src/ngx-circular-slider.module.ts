import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxCircularSliderComponent} from './ngx-cs-slider/ngx-cs-slider.component';
import {NgXCSClockFaceComponent} from './ngx-cs-clock-face/ngx-cs-clock-face.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxCircularSliderComponent,
    NgXCSClockFaceComponent
  ],
  exports: [
    NgxCircularSliderComponent
  ]
})
export class NgxCircularSliderModule {
}
