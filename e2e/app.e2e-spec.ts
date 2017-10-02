import {DemoApp} from './app.po';

describe('NGX-SLIDER DEMO-APP', () => {
  let app: DemoApp;

  beforeEach(() => {
    app = new DemoApp();
  });

  it('should display the slider component', () => {
    app.navigateTo();
    const slider = app.getSliderComponent();

    expect(slider.isPresent).toBeTruthy();
  });
});
