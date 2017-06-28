# ngx-circular-slider

## Installation

To install this library, run:

```bash
$ npm install ngx-circular-slider --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install ngx-circular-slider
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

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<ngx-cs-slider></ngx-cs-slider>
```

## Development

Use [angular-cli](https://github.com/angular/angular-cli) tools to generate, test and lint your code.
Put your library code in **src/app/library** folder. Only this folder and subfolders will be published.

To generate library's `*.js`, `*.d.ts` and `*.metadata.json` files:
```bash
$ npm run publish
```

To generate the doc:
```bash
$ npm run docs
```

## License

MIT © [Alexander Zulechner]
