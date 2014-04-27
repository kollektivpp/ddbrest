var DBB = require('../index.js');

describe('ddbrest initialisation', function() {
    
    describe('should throw an error', function() {

        it('if no access key is given', function() {
            DBB.bind(null).should.throw();
        });

        it('if key has wrong type', function() {
            DBB.bind(null,123123).should.throw();
        });

    });

})