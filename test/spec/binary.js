/*jshint -W030 */

var should = require('should'),
    fs = require('fs'),
    identifier = 'OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF',
    path = 'mvpr/1.jpg';

describe('binary method', function() {

    before(function() {
        should.exist(api.binary);
    });

    describe('should throw an error', function() {

        it('if method gets initialised without required parameters', function() {
             api.binary.bind(null).should.throw();
             api.binary.bind(null, 'dsadsa').should.throw();
        });

        it('if parameters are not typeof string', function() {
             api.binary.bind(null, 1, 2).should.throw();
             api.binary.bind(null, [], {}).should.throw();
             api.binary.bind(null, '1', true).should.throw();
        });

    });

    describe('should provide a get method that', function() {

        before(function() {
            should.exist(api.binary(identifier, path).get);
        });

        it('returns a base64 string', function(done) {
            api.binary(identifier, path).get().then(function(file) {
                file.should.be.type('string');
                done();
            }, done);
        });

    });

    describe('should provide a toFile method that', function() {

        before(function() {
            should.exist(api.binary(identifier, path).toFile);
        });

        it('throws an error if no filename is given', function() {
            api.binary(identifier, path).toFile.bind(null).should.throw();
        });

        it('saves the file to the filesystem', function(done) {
            api.binary(identifier, path).toFile('test.png').then(function() {
                fs.existsSync('test.png').should.be.true;
                done();
            }, done);
        });


    });

});