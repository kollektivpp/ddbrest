/*jshint -W030 */

var should = require('should'),
    type = 'other';

describe('institution method', function() {

    before(function() {
        should.exist(api.institutions);
    });

    describe('should throw an error', function() {

        it('if method gets initialised without required parameters', function() {
             api.institutions.bind(null).should.throw();
        });

        it('if parameter is not typeof string', function() {
             api.institutions.bind(null, 1).should.throw();
             api.institutions.bind(null, {}).should.throw();
             api.institutions.bind(null, []).should.throw();
             api.institutions.bind(null, true).should.throw();
             api.institutions.bind(null, function(){}).should.throw();
        });

    });

    describe('should provide a get method that', function() {

        before(function() {
            should.exist(api.institutions(type).get);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.institutions(type).get.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of institutions', function(done) {
            api.institutions(type).get().then(function(res) {
                res.should.be.an.instanceOf(Array);
                res.should.have.a.lengthOf(49);
                done();
            }, done);
        });

    });

    describe('should provide a sectors method that', function() {

        before(function() {
            should.exist(api.institutions(type).sectors);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.institutions(type).sectors.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of institutions', function(done) {
            api.institutions(type).sectors().then(function(res) {
                res.should.be.an.instanceOf(Array);
                res.should.have.a.lengthOf(7);
                done();
            }, done);
        });

    });


});