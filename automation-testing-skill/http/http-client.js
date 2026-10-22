const { test } = require('@playwright/test');

const AD_REQUESTS = /googlesyndication|doubleclick|adplus|googletagservices/;

class HttpClient {
  constructor(page) {
    this.page = page;
  }

  async blockAds() {
    await test.step('block ad requests', async () => {
      await this.page.route(AD_REQUESTS, (route) => route.abort());
    });
  }
}

module.exports = { HttpClient };
