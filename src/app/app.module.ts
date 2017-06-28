import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {NgxCircularSliderModule} from './ngx-circular-slider-src/ngx-circular-slider.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxCircularSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
