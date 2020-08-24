const { v4: uuidv4 } = require('uuid');

let messageQueue = [];

// This is used for debugging / demonstration
let interval = 0;
setInterval(() => {
	console.log("====");
	console.log("Queue at interval " + interval + ":");
	console.log(messageQueue);
	interval++;
}, 1000);

/*
	A simple function for adding the messageBody into our queue.
*/
function sendMessage(messageBody, callback) {
	try {
		const storedMessage = {
			locked: false,
			messageID: uuidv4(),
			message: {
				receiptHandle: null,
				messageBody: messageBody
			}
		};
		messageQueue.push(storedMessage);
		callback(undefined, storedMessage.messageID)
	}
	catch(err) {
		callback(err)
	};
}

/*
	This function is used when a consumer wants to pull a message from the queue.
		- If the queue is empty we simply return null
		- If non empty we search for the first unlocked element in the queue.
			- Unlocked means the element is not "in-flight": https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html#inflight-messages
		- Once such an element is found, we lock it, generate a receiptHandle used to delete it after
		processing and send it to the consumer
		- If the element has not been deleted by the end of a timeout then the element is unlocked and
		can now be processed by other consumers

	To keep things straightforward we're only allowing consumers to
	consume one message at a time.
*/
function receiveMessage(callback) {
	try {
		/*
			Return null if we have no messages to currently process. This can be improved
			by polling for messages for a period of time, similiar to WaitTimeSeconds from
			Amazon SQS.
		*/
		if (messageQueue.length == 0) {
			callback(undefined, null);
		}
		else {
			/*
				VisibilityTimeout should be set as our maximum processing time per message.
				In our Demo Consumer, we'll set a delay on processing of 3-4 seconds to
				simulate a more realistic scenario.
			*/
			let visibilityTimeout = 25000;

			for (let i = 0; i < messageQueue.length; i++) {
				// Avoids errors when array has been resized during search
				if (typeof messageQueue[i] == 'undefined') {
					break;
				}
				if (messageQueue[i].locked == false) {
					let currentMessageID = messageQueue[i].messageID;
					messageQueue[i].locked = true;
					messageQueue[i].message.receiptHandle = uuidv4();
					callback(undefined, messageQueue[i].message);
					setTimeout(() => {
						for (let j = 0; j < messageQueue.length; j++) {
							// Avoids errors when array has been resized during search
							if (typeof messageQueue[i] == 'undefined' ||
								typeof messageQueue[j] == 'undefined') {
								break;
							}
							if (messageQueue[j].messageID == currentMessageID) {
								messageQueue[i].locked = false; // Make the message available for processing again by other consumers
								break;
							}
						}
					}, visibilityTimeout);
					break; // Breaks out of loop to avoid unnecessarily searching the remainder
				}
				// Returns null if no elements are currently available for processing
				if (i == messageQueue.length - 1 && messageQueue[i].locked == true) {
					callback(undefined, null);
				}
			}
		}
	}
	catch(err) {
		callback(err)
	};
}

/*
	Here we delete a message out of the queue based on the provided
	receiptHandle that was generated during the receiveMessage call.
*/
function deleteMessage(receiptHandle, callback) {
	try {
		for (let i = 0; i < messageQueue.length; i++) {
			if (messageQueue[i].message.receiptHandle == receiptHandle) {
				messageQueue.splice(i, 1); // Delete the message from the queue
			}
		}
		callback(undefined);
	}
	catch(err) {
		callback(err)
	};
}

module.exports = {
	sendMessage: sendMessage,
	receiveMessage: receiveMessage,
	deleteMessage: deleteMessage
}