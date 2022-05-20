import { Browser, BrowserContext, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Job } from 'bull';
import puppeteer from 'puppeteer-extra';

let browserCtx: BrowserContext;
let page: Page;
const isWin = process.platform === 'win32';
let browser: Browser;

const replies = [
  'received, thank you',
  'Well received',
  'make sense',
  'sound good',
  'thank you for the message it was helpful!',
  'Thank you!',
  'got it!',
  'yes, please keep me updated',
  'Thank you, have a nice day',
  'thank you for reaching out to us',
  'we will get in touch ASAP',
  'I will call you soon',
  'please provide more details',
  "it's interesting thank you!",
];

export default async function (job: Job) {
  const { actions, email, password, proxy, compain, verificationemail, file } =
    job.data;
  try {
    const actionsArray = actions.split(',');
    const inbox = actionsArray[0].split('=')[1] === 'true' ? true : false;
    const important = actionsArray[1].split('=')[1] === 'true' ? true : false;
    const starred = actionsArray[2].split('=')[1] === 'true' ? true : false;
    const open = actionsArray[3].split('=')[1] === 'true' ? true : false;
    const is_delete = actionsArray[4].split('=')[1] === 'true' ? true : false;
    const archive = actionsArray[5].split('=')[1] === 'true' ? true : false;
    const reply = actionsArray[6].split('=')[1] === 'true' ? true : false;
    const subject = actionsArray[7].split('=')[1];
    const verify = actionsArray[8].split('=')[1] === 'true' ? true : false;
    const open_bulk = actionsArray[9].split('=')[1] === 'true' ? true : false;
    const add_contact =
      actionsArray[10].split('=')[1] === 'true' ? true : false;

    if (proxy !== 'null') {
      browser = await puppeteer.use(StealthPlugin()).launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--start-maximized',
          `--proxy-server=${proxy}`,
        ],
      });
      const pid = browser.process().pid;
      await job.progress({ screenshot: false, pid });
    } else {
      browser = await puppeteer.use(StealthPlugin()).launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
      });
      const pid = browser.process().pid;
      await job.progress({ screenshot: false, pid });
    }

    browserCtx = await browser.createIncognitoBrowserContext();
    page = await browserCtx.newPage();
    await (await browser.pages())[0].close();

    page.setDefaultNavigationTimeout(60000);

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36.')
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
    );
    // 3. Navigate to URL

    await page.goto('https://mail.google.com/mail/', {
      waitUntil: ['load', 'networkidle0'],
      timeout: 60000,
    });

    // Taking ScreenShot for loging page
    await page.screenshot({
      path: `images/${job.data.email.split('@')[0]}-@-init-${compain}.png`,
    });
    await job.progress({
      screenshot: true,
      path: `${job.data.email.split('@')[0]}-@-init-${compain}.png`,
    });

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.type('input[type=email]', email, {
      delay: 100,
    });

    await page.click('#identifierNext');
    await page.waitForSelector('input[type=password]', { visible: true });
    await page.type('input[type=password]', password, {
      delay: 100,
    });
    await page.click('#passwordNext');

    await page.waitForNavigation({ waitUntil: ['load'] });
    try {
      await page.waitForSelector('input[name=q]', {
        visible: true,
        timeout: 30000,
      });
    } catch (error) {}
    await page.screenshot({
      path: `images/${job.data.email.split('@')[0]}-@-inbox-${compain}.png`,
    });
    await job.progress({
      screenshot: true,
      path: `${job.data.email.split('@')[0]}-@-inbox-${compain}.png`,
    });

    if (add_contact && file) {
      try {
        await page.goto('https://contacts.google.com/', {
          waitUntil: ['load', 'networkidle0'],
          timeout: 60000,
        });
        await page.click('#sdgBod');
        await page.waitForTimeout(2000);
        await page.waitForSelector('a[jsaction="BlwSWe"]', {
          visible: true,
          timeout: 30000,
        });
        //    await page.click('a[jsaction="BlwSWe"]')
        await page.evaluate(() => {
          const element: HTMLAnchorElement = document.querySelector(
            'a[jsaction="BlwSWe"]',
          );
          element.click();
        });
        await page.waitForSelector('input[type=file]', {
          visible: true,
          timeout: 30000,
        });
        const input = await page.$('input[type=file]');
        await input.uploadFile(`contacts/${file}`);
        await page.waitForTimeout(10000);
        await page.waitForSelector('div.VfPpkd-Jh9lGc', { timeout: 30000 });
        await page.waitForTimeout(10000);
        const elements = await page.evaluate(async () => {
          const elements: NodeListOf<HTMLDivElement> =
            document.querySelectorAll('div.VfPpkd-Jh9lGc');
          elements.length === 3 ? elements[2].click() : elements[4].click();
          return elements;
        });
        console.log(elements);
        await page.waitForTimeout(20000);
        await page.screenshot({
          path: `images/${
            job.data.email.split('@')[0]
          }-@-finished-${compain}.png`,
        });
        await job.progress({
          screenshot: true,
          path: `${job.data.email.split('@')[0]}-@-finished-${compain}.png`,
        });
        await page.waitForTimeout(5000);
        await browserCtx.close();
        await browser.close();
        return Promise.resolve('lok');
      } catch (error) {
        console.log(error);
        await page.screenshot({
          path: `images/${
            job.data.email.split('@')[0]
          }-@-finished-${compain}.png`,
        });
        await job.progress({
          screenshot: true,
          path: `${job.data.email.split('@')[0]}-@-finished-${compain}.png`,
        });
        await browserCtx.close();
        await browser.close();
        return Promise.reject(error.message);
      }
    }

    if (verify) {
      try {
        await page.waitForSelector('input[name=q]', {
          visible: true,
          timeout: 30000,
        });
        await browserCtx.close();
        await browser.close();
        return Promise.resolve('verified');
      } catch {
        try {
          await page.waitForSelector('div[data-challengetype="12"]', {
            visible: true,
          });
          await page.waitForTimeout(5000);
          await page.click('div[data-challengetype="12"]', { clickCount: 2 });
          await page.waitForTimeout(5000);
          await page.waitForSelector('input[type=email]', { visible: true });
          await page.type('input[type=email]', verificationemail, {
            delay: 300,
          });
          await page.waitForTimeout(5000);
          await page.keyboard.press('Enter', { delay: 300 });
          try {
            await page.waitForSelector('input[name=q]', {
              visible: true,
              timeout: 30000,
            });
            await page.screenshot({
              path: `images/${
                job.data.email.split('@')[0]
              }-@-finished-${compain}.png`,
            });
            await job.progress({
              screenshot: true,
              path: `${job.data.email.split('@')[0]}-@-finished-${compain}.png`,
            });
          } catch {
            await page.screenshot({
              path: `images/${
                job.data.email.split('@')[0]
              }-@-finished-${compain}.png`,
            });
            await job.progress({
              screenshot: true,
              path: `${job.data.email.split('@')[0]}-@-finished-${compain}.png`,
            });
          }
          await page.waitForTimeout(5000);
          await browserCtx.close();
          await browser.close();
          return Promise.resolve('done');
        } catch {
          await browserCtx.close();
          await browser.close();
          return Promise.reject('error');
        }
      }
    }

    try {
      await page.waitForSelector('#view_container', { visible: true });
      await page.evaluate(async () => {
        function delay(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        const element: HTMLDivElement =
          document.querySelector('#view_container');
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'end',
        });
        await delay(5000);
        const elements: NodeListOf<HTMLDivElement> =
          document.querySelectorAll('div[role=button]');
        elements[1].click();
      });
      await page.waitForNavigation({ waitUntil: ['load'] });
    } catch (error) {}

    if (open_bulk) {
      return await (async function openBulkProcess() {
        await page.waitForTimeout(10000);
        subject
          ? await page.goto(
              `https://mail.google.com/mail/u/1/#search/in%3Ainbox+subject%3A${subject}+is%3Aunread`,
              { waitUntil: 'load' },
            )
          : await page.goto(
              `https://mail.google.com/mail/u/1/#search/in%3Ainbox+is%3Aunread`,
              { waitUntil: 'load' },
            );
        await page.waitForSelector('span[role=checkbox]', { visible: true });
        await page.click('span[role=checkbox]');
        return page
          .click('[act="1"]')
          .then(async () => {
            return await openBulkProcess();
          })
          .catch(async () => {
            await page.waitForTimeout(6000);
            await page.screenshot({
              path: `images/${
                job.data.email.split('@')[0]
              }-@-finished-${compain}.png`,
            });
            await job.progress({
              screenshot: true,
              path: `${job.data.email.split('@')[0]}-@-finished-${compain}.png`,
            });
            await page.waitForTimeout(5000);
            await browserCtx.close();
            await browser.close();
            return Promise.resolve('done');
          });
      })();
    }

    if (inbox) {
      return await (async function spamProcess() {
        subject
          ? await page.goto(
              `https://mail.google.com/mail/u/1/#search/in%3Aspam+subject%3A${subject}+is%3Aunread`,
              { waitUntil: 'load' },
            )
          : await page.goto(
              `https://mail.google.com/mail/u/1/#search/in%3Aspam+is%3Aunread`,
              { waitUntil: 'load' },
            );
        await page.waitForSelector('span[role=checkbox]', { visible: true });
        await page.click('span[role=checkbox]');
        return page
          .click('[act="8"]')
          .then(async () => {
            await page.waitForTimeout(6000);
            return await spamProcess();
          })
          .catch(async () => {
            await page.waitForTimeout(6000);
            await page.screenshot({
              path: `images/${
                job.data.email.split('@')[0]
              }-@-spam-${compain}.png`,
            });
            await job.progress({
              screenshot: true,
              path: `${job.data.email.split('@')[0]}-@-spam-${compain}.png`,
            });
            await page.waitForTimeout(5000);
            await browserCtx.close();
            await browser.close();
            return Promise.resolve('done');
          });
      })();
    }
    if (open && !open_bulk) {
      try {
        return await (async function defaultProcess() {
          subject
            ? await page.goto(
                `https://mail.google.com/mail/u/1/#search/in%3Ainbox+subject%3A${subject}+is%3Aunread`,
                { waitUntil: 'load' },
              )
            : await page.goto(
                `https://mail.google.com/mail/u/1/#search/in%3Ainbox+is%3Aunread`,
                { waitUntil: 'load' },
              );
          return page
            .waitForSelector('tr[draggable=false]', { visible: true })
            .then(async () => {
              if (open) {
                let table = await page.$$('tr[draggable=false]');
                page.on('framedetached', async () => {
                  try {
                    table = await page.$$('tr[draggable=false]');
                  } catch (error) {}
                });
                for (const tr of table) {
                  await page.waitForSelector('tr[draggable=false]', {
                    visible: true,
                  });
                  await tr.click();
                  await page.waitForTimeout(2000);
                  await page.waitForSelector('[act="19"]', { visible: true });
                  if (reply) {
                    await page.evaluate(() =>
                      document
                        .querySelector<HTMLSpanElement>('span.ams.bkH')
                        .click(),
                    );
                    await page.waitForTimeout(2000);
                    await page.waitForSelector('div[role="textbox"]', {
                      visible: true,
                    });
                    let textbox = await page.$$('div[role="textbox"]');
                    const item =
                      replies[Math.floor(Math.random() * replies.length)];
                    await textbox[0].type(item, { delay: 100 });
                    let btn = await page.$('div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3');
                    await btn.click();
                    await page.waitForTimeout(2000);
                  }
                  await page.click('[act="19"]');
                }
              }
              if (important || starred) {
                await page.evaluate(
                  async (important, starred) => {
                    function delay(ms: number) {
                      return new Promise((resolve) => setTimeout(resolve, ms));
                    }
                    if (important) {
                      const elements: NodeListOf<HTMLTableCellElement> =
                        document.querySelectorAll('[role=img]');
                      for (const ele of elements) {
                        await delay(1000);
                        ele.click();
                      }
                    }
                    if (starred) {
                      const elements_1: NodeListOf<HTMLTableCellElement> =
                        document.querySelectorAll('.apU.xY');
                      for (const ele_1 of elements_1) {
                        await delay(1000);
                        ele_1.click();
                      }
                    }
                  },
                  important,
                  starred,
                );
              }
              return await defaultProcess();
            })
            .catch(async (err) => {
              console.log('open error', err.message);
              if (err.message === 'Node is detached from document') {
                return await defaultProcess();
              }
              await page.waitForTimeout(6000);
              await page.screenshot({
                path: `images/${
                  job.data.email.split('@')[0]
                }-@-finished-${compain}.png`,
              });
              await job.progress({
                screenshot: true,
                path: `${
                  job.data.email.split('@')[0]
                }-@-finished-${compain}.png`,
              });
              await page.waitForTimeout(5000);
              await browserCtx.close();
              await browser.close();
              return Promise.resolve('done');
            });
        })();
      } catch (error) {
        return Promise.reject(`Unexpected Error ${error.message}`);
      }
    }
    if (archive) {
      try {
        return await (async function archiveProcess() {
          subject
            ? await page.goto(
                `https://mail.google.com/mail/u/1/#search/in%3Ainbox+subject%3A${subject}+is%3Aread`,
                { waitUntil: 'load' },
              )
            : await page.goto(
                `https://mail.google.com/mail/u/1/#search/in%3Ainbox+is%3Aread`,
                { waitUntil: 'load' },
              );
          await page.waitForSelector('span[role=checkbox]', { visible: true });
          await page.click('span[role=checkbox]');
          return page
            .click('[act="7"]')
            .then(async () => {
              await page.waitForTimeout(6000);
              return await archiveProcess();
            })
            .catch(async () => {
              await page.waitForTimeout(5000);
              await browserCtx.close();
              await browser.close();
              return Promise.resolve('done');
            });
        })();
      } catch (error) {
        await page.close();
        return Promise.reject(`Unexpected Error ${error.message}`);
      }
    }
    if (is_delete) {
      try {
        return await (async function deleteProcess() {
          subject
            ? await page.goto(
                `https://mail.google.com/mail/u/1/#search/in%3Ainbox+subject%3A${subject}+is%3Aread`,
                { waitUntil: 'load' },
              )
            : await page.goto(
                `https://mail.google.com/mail/u/1/#search/in%3Ainbox+is%3Aread`,
                { waitUntil: 'load' },
              );
          await page.waitForSelector('span[role=checkbox]', { visible: true });
          await page.click('span[role=checkbox]');
          return page
            .click('[act="10"]')
            .then(async () => {
              await page.waitForTimeout(6000);
              return await deleteProcess();
            })
            .catch(async () => {
              await page.waitForTimeout(6000);
              await page.screenshot({
                path: `images/${
                  job.data.email.split('@')[0]
                }-@-read-${compain}.png`,
              });
              await job.progress({
                screenshot: true,
                path: `${job.data.email.split('@')[0]}-@-read-${compain}.png`,
              });
              await page.waitForTimeout(5000);
              await browserCtx.close();
              await browser.close();
              return Promise.resolve('done');
            });
        })();
      } catch (error) {
        await page.close();
        return Promise.reject(`Unexpected Error ${error.message}`);
      }
    }
  } catch (error) {
    console.log('waaayli', error);
    if (page) {
      await page.waitForTimeout(3000);
      await page.screenshot({
        path: `images/${
          job.data.email.split('@')[0]
        }-@-final-error-${compain}.png`,
      });
      await job.progress({
        screenshot: true,
        path: `${job.data.email.split('@')[0]}-@-final-error-${compain}.png`,
      });
      if (browserCtx) {
        await browserCtx.close();
        await browser.close();
      }
      return Promise.reject(`Unexpected Error ${error.message}`);
    }
    if (browserCtx) {
      await browserCtx.close();
      await browser.close();
    }
    return Promise.reject(`Unexpected Error ${error.message}`);
  }
}
