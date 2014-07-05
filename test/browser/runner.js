var MochaSauce = require('mocha-sauce');

// configure
var sauce = new MochaSauce({
    name: 'ddbrest',
    username: 'ddbrest',// process.env.SAUCE_USERNAME,
    accessKey: 'd1e6d757-ce6c-4b5c-a5a3-4f6ad437acce',// process.env.SAUCE_ACCESS_KEY,
    host: 'http://ondemand.sauce.com',
    port: 80,

    // the test url
    url: 'http://www.christian-bromann.com/ddbrest/test/browser/index.html' // point to the site running your mocha tests
});


// setup what browsers to test with
sauce.browser({ browserName: 'chrome', platform: 'Windows 7' });
sauce.browser({ browserName: 'firefox', platform: 'Windows XP', version: '21' });
sauce.browser({ browserName: 'internet explorer', platform: 'Windows 8', version: '10' });
sauce.browser({ browserName: 'internet explorer', platform: 'Windows XP', version: '8' });
sauce.browser({ browserName: 'firefox', platform: 'Windows 8', version: '21' });


sauce.on('init', function(browser) {
    console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
    console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
    console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start(function() {
    console.log(arguments);
});