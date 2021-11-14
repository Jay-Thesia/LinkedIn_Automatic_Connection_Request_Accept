//node LinkedInAccept.js --url= "https://in.linkedin.com/home" --config = "config.json"         //node LinkedInAccept.js --url="https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin" --config="config.json"

let minimist = require('minimist');
let fs = require("fs");
let puppeteer = require("puppeteer");
const { fromBuffer } = require('yauzl');


let clargs = minimist(process.argv);
let configJson = fs.readFileSync(clargs.config, 'utf-8');
let configJso = JSON.parse(configJson);




async function browserFunc() {
    let browser = await puppeteer.launch({
        headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: null
    });

    //get the tabs(there is only one tab)
    let pages = await browser.pages();
    let page = pages[0]

    //open url
    await page.goto(clargs.url);


    await page.waitFor(2000);

    await page.waitForSelector("a.nav__button-secondary");
    await page.click("a.nav__button-secondary");
    //enter username and password

    await page.click("input#username");
    await page.waitForSelector("input#username");
    await page.type("input#username", configJso.username, { delay: 40 });

    await page.waitFor(3000);
    await page.type("input#password", configJso.password, { delay: 70 });

    //wait for sign up button click and then click it
    await page.waitFor(2000)
    await page.waitForSelector("button.btn__primary--large.from__button--floating");
    await page.click("button.btn__primary--large.from__button--floating");


    //click on mynetwork
    await page.waitFor(5000);
    await page.waitForSelector("a[href='/mynetwork/']", { visible: true });
    await page.click("a[href ='/mynetwork/']");



    // await page.waitForSelector("a.msg-overlay-bubble-header__control.msg-overlay-bubble-header__control--new-convo-btn.artdeco-button.artdeco-button--circle > li-icon[type='chevron-down-icon']", { visible: true });
    // await page.click("a.msg-overlay-bubble-header__control.msg-overlay-bubble-header__control--new-convo-btn.artdeco-button.artdeco-button--circle > li-icon[type='chevron-down-icon']");


    await page.waitForNavigation();
    await page.waitForSelector("a[href='/mynetwork/invitation-manager/']");
    await page.click("a[href='/mynetwork/invitation-manager/']");
    await page.click("a[href='/mynetwork/invitation-manager/']");

    await page.waitForNavigation();
    await page.waitFor(7000);
    await page.waitForSelector("button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn");

    let count = await page.$$eval('button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn', element => element.length);
    console.log(count);

    let i = 1;
    while (i <= count) {
        await page.waitFor(2000);
        await page.click("button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.invitation-card__action-btn");
        i++;
    }


    console.log("Browser is closed");


}

browserFunc();