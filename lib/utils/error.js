/**
 * error handler to create custome errors
 */

var util = require('util');

function ErrorHandler(type, msg) {
    Error.call(this);

    this.message = msg;
    this.name = type;
}

util.inherits(ErrorHandler, Error);

/**
 * make stack loggable
 * @return {Object} error log
 */
ErrorHandler.prototype.toJSON = function() {
    return {
        name: this.name,
        message: this.message
    };
};

/**
 * expose ErrorHandler
 */
module.exports = ErrorHandler;