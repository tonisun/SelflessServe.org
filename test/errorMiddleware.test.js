const chai = require('chai');
const sinon = require('sinon');
const errorMiddleware = require('../middlewares/errorMiddleware');
const ErrorHandler = require('../utils/errorHandler');

const { expect } = chai;

// Test Suite for errorMiddleware
describe('Error Middleware', function() {

    // Test Cases: Development Error Response Test
    it('should send a development error response', function() {
        const err = new ErrorHandler('Test error', 400);
        const req = { path: '/test' };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        process.env.NODE_ENV = 'development';

        errorMiddleware(err, req, res, {});

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
        success: false,
        error: err,
        errMessage: 'Test error',
        stack: err.stack,
        })).to.be.true;
    });

    // Production Error Response Test
    it('should send a production error response', function() {
        const err = new ErrorHandler('Test error', 400);
        const req = { path: '/test' };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        process.env.NODE_ENV = 'production';

        errorMiddleware(err, req, res, {});

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
        success: false,
        message: 'Test error',
        })).to.be.true;
    });
});