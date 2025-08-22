module.exports = {
  timeout: 200000,
  reporter: 'spec',
  require: ['dotenv/config'],
  spec: './test/**/*.test.js',
  'reporter-option': [
    'reportDir=reports',
    'reportFilename=test-report',
    'reportTitle=Clinn API Test Report',
    'reportPageTitle=Clinn API Test Results',
    'embeddedScreenshots=true',
    'inlineAssets=true',
    'saveAllAttempts=false'
  ]
};

