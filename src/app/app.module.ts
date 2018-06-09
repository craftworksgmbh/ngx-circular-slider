import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NgxCircularSliderModule } from "projects/ngx-circular-slider/src/public_api";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxCircularSliderModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
