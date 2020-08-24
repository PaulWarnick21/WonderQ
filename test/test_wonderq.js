const wonderq = require('../lib/wonderq');
const chai = require('chai');
const expect = chai.expect;

let receiptHandle_G = ""; // Used to test delete, receiptHandle is saved globally

describe('sendMessage()', function () {
	it('should send a message to the queue and confirm MessageID is returned', function () {
		wonderq.sendMessage(0, (err, message_id) => {
			if (err !== undefined) {
				expect(err).to.be.a(Error);
			}

			expect(message_id).to.be.a('string');
			expect(message_id).to.have.lengthOf(36);
		});
	});
});

describe('receiveMessage()', function () {
	it('should receive a message from the queue and confirm there is a valid receiptHandle', function () {
		wonderq.receiveMessage((err, message) => {
			if (err !== undefined) {
				expect(err).to.be.a(Error);
			}

			receiptHandle_G = message.receiptHandle;

			expect(message).to.be.a('object');
			expect(message.messageBody).to.be.a('number');
			expect(message.messageBody).to.equal(0);
			expect(message.receiptHandle).to.be.a('string');
			expect(message.receiptHandle).to.have.lengthOf(36);
		});
	});
});

describe('deleteMessage()', function () {
	it('should delete a message from the queue', function () {
		wonderq.deleteMessage(receiptHandle_G, (err, success) => {
			if (err !== undefined) {
				expect(err).to.be.a(Error);
			}

			expect(success).to.equal(undefined);
		});
	});
});
