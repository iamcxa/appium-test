require('colors');

import colors from 'colors';
import _ from 'underscore';
import wd from 'wd';
import appRoot from 'app-root-path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import serverConfigs from '../helpers/appium-servers';
import logging from '../helpers/logging';
import actions from '../helpers/actions';

wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('pinch', actions.pinch);
wd.addElementPromiseChainMethod('pinch', function () {
  return this.browser.pinch(this);
});
wd.addPromiseChainMethod('zoom', actions.zoom);
wd.addElementPromiseChainMethod('zoom', function () {
  return this.browser.zoom(this);
});

chai.use(chaiAsPromised);
const should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
const asserters = wd.asserters;
const Asserter = wd.Asserter;



module.exports = {
  _,
  wd,
  should,
  logging,
  Asserter,
  asserters,
  serverConfigs,
};
