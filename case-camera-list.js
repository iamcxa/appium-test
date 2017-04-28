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
  KEYCODE_ENTER,
  KEYCODE_DOWN,
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

  it("should display camera list", async function() {

    return await driver
    .elementById('ibCameraMap')
      .click()
    .elementById('rlOutdoorMap')
      .should.eventually.exist
      .sleep(100)
      .pinch()
    .elementById('action_reLocated')
      .click()
    .pressDeviceKey(KEYCODE_MENU)
    .elementByXPath('//android.widget.TextView[@text=\'Switch to List\']')
      .should.eventually.exist
      .click()
      .sleep(1000)
    .pressDeviceKey(KEYCODE_DOWN)
      .sleep(200)
    .pressDeviceKey(KEYCODE_ENTER)
      .sleep(200)
    .pressDeviceKey(KEYCODE_ENTER)
      .sleep(2000)
    .elementByXPath('//android.widget.TextView[@text="camera 1"]')
      .click()
      .sleep(30000)
    .elementById('playButton')
      .click()
      .sleep(5000)
    .elementById('playButton')
      .click()
      .sleep(15000)
      .back();
  });
});
