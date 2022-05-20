const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

(async () => {
  puppeteer.use(StealthPlugin({}));
  puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())
  puppeteer.use(require('puppeteer-extra-plugin-user-preferences')())

  const browser = await puppeteer.launch({
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--proxy-server=142.4.0.178:3838`
    ]
  });
  
 

  browserCtx = await browser.createIncognitoBrowserContext();
  page = await browserCtx.newPage();
  

  await page.evaluateOnNewDocument(() => {
      Object.defineProperty(window, 'navigator', {
        value: new Proxy(navigator, {
          has: (target, key) => (key === 'webdriver' ? false : key in target),
          get: (target, key) =>
            key === 'webdriver'
              ? undefined
              : typeof target[key] === 'function'
              ? target[key].bind(target)
              : target[key]
        })
      }) 
  })  
  await page.goto('https://mail.google.com/mail/' ,  { waitUntil: ["load","networkidle0"] ,timeout:0 });
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();