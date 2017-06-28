import { MyPage } from './app.po';

describe('my App', () => {
  let page: MyPage;

  beforeEach(() => {
    page = new MyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
