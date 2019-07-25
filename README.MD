# ngx-circular-slider
### powered by [craftworks GmbH](https://craftworks.at) used in the own TimeTracking Product
#### inspired by iOS bedtime and [react-native-circular-slider](https://github.com/bgryszko/react-native-circular-slider)

## Demo
check out the repo on stackblitz: [demo](https://stackblitz.com/github/craftworksgmbh/ngx-circular-slider)

![demo-pic](src/assets/slider-demo.gif)

## Installation

To install this the slider, run:

```bash
npm install ngx-circular-slider --save
```

## Consuming your ngx-circular-slider

You can import the slider in any Angular application by running:

```bash
npm install ngx-circular-slider
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { NgxCircularSliderModule } from 'ngx-circular-slider';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    NgxCircularSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once the ngx-circular-slider module is imported, you can use it in your Angular application:

```html
<!-- You can now use the slider in app.component.html -->
<ngx-cs-slider (update)="handleSliderChange($event)"
               [props]="sliderProps"
               [startAngle]="start"
               [angleLength]="length">
```

## API

* **`startAngle`** [`number`] - **required** the angle of the circle where the slider starts
* **`angleLength`** [`number`] - **required** the length of the circum-radius for the slider
* **`update`** [`$event({angleLength: number; startAngle: number;})`] - the handler for the update event which returns the angleLength and the startAngle after the slider was changed
* **`props`** [`IProps`] - the properties for the slider.
```typescript
interface IProps {
  segments?: number;
  strokeWidth?: number;
  radius?: number;
  gradientColorFrom?: string;
  gradientColorTo?: string;
  bgCircleColor?: string;
  showClockFace?: boolean;
  clockFaceColor?: string;
}
```

## todos
* test module api
* adapt readme
* replace gulp with webpack --> done with the angular cli
* generate types without *.d.ts -> done
* fixes module-api
* tests

## Development

Use [angular-cli](https://github.com/angular/angular-cli) tools to generate, test and lint your code.
Put your library code in **src/app/lib** folder. Only this folder and subfolders will be published.

- to make the app run and or change and publish:
  -  use node version `10.16.` or if you use nvm use `nvm use`
  - then run `npm install` 

- To generate library's `*.js`, `*.d.ts` and `*.metadata.json` files:
```bash
npm run build:slider
npm version patch|minor|major
cd dist/ngx-circular-slider
npm version patch|minor|major
npm publish
```
-To generate the doc:
```bash
npm run docs
```

## License

MIT © [Alexander Zulechner@craftworks GmbH](mailto:alexander.zulechner@craftworks.at)
