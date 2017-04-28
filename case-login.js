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

  it('should login and show menu', function() {
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
          .catch(null);
      }
    );
    return driver
      .elementById('btnAgree')
        .click()
      .elementById('etServerIp')
        .clear()
        .sendKeys('172.16.15.164')
      .elementById('etUserName')
        .clear()
        .sleep(100)
        .sendKeys('qaadmin')
      .elementById('etPassword')
        .clear()
        .sleep(100)
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

  it("should logout.", function() {
    return driver
      .pressDeviceKey(KEYCODE_MENU)
      .elementByXPath('//android.widget.TextView[@text=\'Logout\']')
        .should.eventually.exist
        .click()
        .sleep(1000)
      .elementById('button1')
        .should.eventually.be.exist
        .sleep(1000)
        .click()
        .should.eventually.be.ok
  });

});
