describe('ddbrest initialisation should throw an error', function() {

    it('if no access key is given', function() {
        DDBRest.bind(null).should.throw();
    });

    it('if key has wrong type', function() {
        DDBRest.bind(null,123123).should.throw();
    });

});