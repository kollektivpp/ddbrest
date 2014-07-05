/*jshint -W030 */

var identifier = 'OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF',
    path = 'mvpr/1.jpg';

describe('binary method', function() {

    this.timeout(100000);

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

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.binary(identifier, path).get.bind(null, function(){}).should.throw();
        });

        it('returns a base64 string', function() {
            return expect(api.binary(identifier, path).get()).to.be.eventually.a('string');
        });

        it('saves no file if identifier is wrong', function() {
            return api.binary('doesnotexist', path).get().should.be.rejectedWith('Item \'doesnotexist\' not found.');
        });

        it('calls failure request if path is wrong', function() {
            return api.binary(identifier, 'does/not/exists.png').get().should.be.rejectedWith(/\/does\/not\/exists\.png not found/);
        });

    });

    /**
     * toFile() function will not be tested within the browser
     */
    if(typeof process === 'undefined') {
        return;
    }

    describe('should provide a toFile method that', function() {

        var fs = require('fs');

        before(function() {
            should.exist(api.binary(identifier, path).toFile);
        });

        it('throws an error if no filename is given', function() {
            api.binary(identifier, path).toFile.bind(null).should.throw();
        });

        it('saves the file to the filesystem', function() {
            return api.binary(identifier, path).toFile('test.png').should.be.fulfilled.then(function() {
                fs.existsSync('test.png').should.be.true;
            });
        });

        it('saves no file if identifier is wrong', function() {
            return api.binary('doesnotexist', path).toFile('noexist.png').should.be.rejectedWith('Item \'doesnotexist\' not found.').then(function() {
                fs.existsSync('identifierNotExisting.png').should.be.false;
            });
        });

        it('saves no file if path is wrong', function() {
            return api.binary(identifier, 'does/not/exists.png').toFile('noexist.png').should.be.rejectedWith(/\/does\/not\/exists\.png not found/).then(function() {
                fs.existsSync('pathNotExisting.png').should.be.false;
            });
        });

    });

});