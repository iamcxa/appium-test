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

describe("Cityeyes test case - from Login to play stream", function() {
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
        .clear()
        .sendKeys('admin')
      .elementById('etPassword')
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

  it("should display camera list", function() {
    return driver
      .elementById('ibCameraMap')
        .click()
      .elementById('rlOutdoorMap')
        .click()
        .sleep(100)
        .pinch()
      .elementById('action_reLocated')
        .click()
      .pressDeviceKey(KEYCODE_MENU)
      .elementByXPath('//android.widget.TextView[@text=\'Switch to List\']')
        .click()
      .elementByXPath('//*[@class="android.widget.TextView" and @text="All Cameras"]')
        .click()
        .should.eventually.be.ok;
  });

  it.skip("should play camera streams.", function() {
    return driver
      .elementByXPath('//android.widget.TextView[@text=\'All Cameras\']')
        .click()
        .sleep(5000)
      .elementByXPath('//*[@index=\'1\']')
        .click()
        .sleep(20000)
        .back()
        .should.eventually.be.ok
  });

  it.skip("should logout.", function() {
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
