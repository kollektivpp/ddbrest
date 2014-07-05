// make lib global available through all tests
GLOBAL.DDBRest = require('../index.js');
GLOBAL.Q = require('q');
GLOBAL.facetTestHelper = require('./utils/facetTestHelper');
GLOBAL.api = new DDBRest(process.env.DDBREST_KEY);

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Q = require('q');

chai.should();
chai.use(chaiAsPromised);

global.chaiAsPromised = chaiAsPromised;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();

global.fulfilledPromise = Q.resolve;
global.rejectedPromise = Q.reject;
global.defer = Q.defer;