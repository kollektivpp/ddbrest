var ErrorHandler = require('../../lib/utils/error'),
    name = 'CustomException',
    message = 'some error message';

describe.only('ErrorHandler', function() {

    it('should throw error with custom type and message', function() {
        var err = new ErrorHandler(name, message);
        var fn = function(){ throw err; };
        expect(fn).to.throw(message);
    });

    it('should provide a toJSON function for logging purposes', function() {
        var err = new ErrorHandler(name, message);
        expect(err).to.have.property('toJSON');
        err.toJSON().name.should.be.deep.equal(name);
        err.toJSON().message.should.be.deep.equal(message);
    });

});