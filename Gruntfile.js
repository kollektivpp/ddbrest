var SauceLabs = require('saucelabs');

module.exports = function(grunt) {
    var browsers = [{
        browserName: 'firefox',
        version: '31',
        platform: 'Windows 8.1'
    }, {
        browserName: 'firefox',
        version: '29',
        platform: 'Windows 8.1'
    }, {
        browserName: 'firefox',
        version: '26',
        platform: 'Windows 8.1'
    }, {
        browserName: 'chrome',
        version: '36',
        platform: 'Windows 8.1'
    }, {
        browserName: 'firefox',
        version: '33',
        platform: 'Windows 8.1'
    }, {
        browserName: 'firefox',
        version: '30',
        platform: 'Windows 8.1'
    }, {
        browserName: 'internet explorer',
        version: '11',
        platform: 'Windows 8.1'
    }, {
        browserName: 'internet explorer',
        version: '10',
        platform: 'Windows 7'
    }, {
        browserName: 'internet explorer',
        version: '9',
        platform: 'Windows 7'
    }];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'saucelabs-mocha': {
            all: {
                options: {
                    username: process.env.SAUCE_USERNAME,
                    key: process.env.SAUCE_ACCESS_KEY,
                    urls: ['http://www.christian-bromann.com/ddbrest/test/browser/index.html'],
                    browsers: browsers,
                    build: process.env.TRAVIS_JOB_ID,
                    testname: 'mocha tests',
                    tunneled: false,
                    throttled: 9,
                    sauceConfig: {
                        'video-upload-on-pass': false
                    },
                    onTestComplete: function(result, callback) {
                        var sauceAccount = new SauceLabs({
                            username: process.env.SAUCE_USERNAME,
                            password: process.env.SAUCE_ACCESS_KEY
                        });

                        console.log('update status of job ID', result.job_id, ',', 'status: ' + result.passed);
                        sauceAccount.updateJob(result.job_id, {
                            passed: result.passed,
                            public: true
                        }, function() {});
                    }
                }
            }
        },
        watch: {}
    });

    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.registerTask('default', ['saucelabs-mocha']);
};