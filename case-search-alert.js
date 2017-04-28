
"use strict";

import { android23 } from './helpers/caps';
import { cityeyes } from './helpers/apps';
import {
  _,
  wd,
  logging,
  Asserter,
  serverConfigs,
} from "./helpers/setup";

import {
  KEYCODE_MENU,
  KEYCODE_BACK,
} from './helpers/android-keycode';

describe("Test Start - Cityeyes Login", function() {
  this.timeout(300000);
  let driver;
  let allPassed = true;

  before(function() {
    driver = wd.promiseChainRemote(serverConfigs.local);
    logging.configure(driver);

    const desired = android23 ;
    desired.app = cityeyes;

    return driver
      .init(desired)
      .setImplicitWaitTimeout(3000);
  });

  after(function() {
    return driver
      .quit()
      .finally(function() {
        console.log("Test End.");
      });
  });

  afterEach(function() {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it('should logined and show menu', function() {
    const tagChaiAssertionError = function(err) {
      // throw error and tag as retriable to poll again
      err.retriable = err instanceof chai.AssertionError;
      throw err;
    };
    // another simple element asserter
    const customIsDisplayed = new Asserter(
      function(el) {
        return el
          .isDisplayed().should.eventually.be.ok
          .click()
          .catch(tagChaiAssertionError);
      }
    );
    return driver
      .elementById('btnAgree')
        .click()
      .elementById('etServerIp')
        .clear()
        .sendKeys('172.16.15.182')
      .elementById('etUserName')
        .sleep(100)
        .clear()
        .sendKeys('admin')
      .elementById('etPassword')
        .sleep(100)
        .clear()
        .sendKeys('password')
      .elementById('btnLogin')
        .click()
        .sleep(500)
      .waitForElementById(
        'com.android.packageinstaller:id/permission_allow_button',
        customIsDisplayed,
        2000)
      .waitForElementById(
        'com.android.packageinstaller:id/permission_allow_button',
        customIsDisplayed,
        2000)
      .elementById('ibAlertDashboard')
        .should.eventually.exist
      .elementById('ibCameraMap')
        .should.eventually.exist;
  });

  it("should display AlertDashboard and search", async function() {
    return await driver
    .elementById('ibAlertDashboard')
      .click()
    .elementById('action_search')
      .click()
    .elementByXPath('//*[@class="android.widget.TextView" and @text="Start Date"]')
      .click()
    .elementById('prev')
      .click()
      .sleep(100)
      .click()
    .elementByXPath('//*[@class="android.view.View" and @text="1"]')
      .click()
    .elementByXPath('//*[@class="android.widget.Button" and @text="OK"]')
      .click()
    .elementById('btnSearch')
      .click()
      .sleep(10000)

  });

});
