// make lib global available through all tests
GLOBAL.DDBRest = require('../index.js');
GLOBAL.api = new DDBRest(process.env.DDBREST_KEY);