import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxCircularSliderComponent } from "./ngx-cs-slider/ngx-cs-slider.component";
import { NgXCSClockFaceComponent } from "./ngx-cs-clock-face/ngx-cs-clock-face.component";
import { NgxCalculationService } from "./services/ngx-calculation.service";

@NgModule({
  imports: [CommonModule],
  declarations: [NgxCircularSliderComponent, NgXCSClockFaceComponent],
  providers: [NgxCalculationService],
  exports: [NgxCircularSliderComponent]
})
export class NgxCircularSliderModule {}
