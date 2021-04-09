import {WebWiewResources} from '../WebWiewResources';

export class WebWiewResourcesMock implements WebWiewResources {
  getWebViewBasePath() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {} as any;
  }

  getWebViewContent() {
    return '<html lang="en"><head></head><body></body></html>';
  }
}
