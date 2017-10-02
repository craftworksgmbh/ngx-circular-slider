import { browser, by, element } from 'protractor';

export class DemoApp {
  navigateTo() {
    return browser.get('/');
  }

  getSliderComponent() {
    return element(by.css('ngx-cs-slider'));
  }
}
