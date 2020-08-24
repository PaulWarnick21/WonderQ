const wonderq = require('./lib/wonderq')

module.exports = function(app) {
	app.post('/messages', function(req, res) {
		// Adds a new message to the queue and returns the MessageID 
		wonderq.sendMessage(
			req.body.message
		, (err, message_id) => {
			if (err !== undefined) {
				return res.status(400).json({
					status: 'error',
					error: err
				});
			}
			return res.status(200).json({
				status: 'success',
				message_id: message_id
			});
		});
	});
	
	app.get('/messages', function(req, res) {
		// Allows a consumer to pull a message from the queue
		wonderq.receiveMessage((err, message) => {
			if (err !== undefined) {
				return res.status(400).json({
					status: 'error',
					error: err
				});
			}

			return res.status(200).json({
				status: 'success',
				message: message
			});
		});
	});

	app.delete('/messages/:receiptHandle', (req, res) => {
		// Deletes the message with a specific receiptHandle from the queue
		wonderq.deleteMessage(req.params.receiptHandle, (err, success) => {
			if (err !== undefined) {
				return res.status(400).json({
					status: 'error',
					error: err
				});
			}

			return res.status(200).json({
				status: 'success'
			});
		});
	});
}
