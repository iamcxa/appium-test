const appRoot = require('app-root-path');

if (process.env.DEV) {
  exports.cityeyes = appRoot + "/apk/app-debug.apk";
} else {
  exports.cityeyes = appRoot + "/apk/app-debug.apk";
}
