// eslint-disable-next-line node/no-extraneous-require
const reporters = require('@jest/reporters');

class MyCustomReporter extends reporters.DefaultReporter {
  constructor(globalConfig, options) {
    super(globalConfig, options);
  }

  log(message) {
    console.log(message);
    //process.stdout.write(message + '\n');
  }
}

module.exports = MyCustomReporter;
