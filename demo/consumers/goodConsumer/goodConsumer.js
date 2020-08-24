const axios = require('axios');

/*
	This is an example of a consumer that successfully processes each
	message it receives.
*/
setInterval(() => {
	axios.get('http://localhost:8080/messages')
	.then((res) => {
		if (res.data.message != null) {
			// Artificial delay to simulate processing time of 3 seconds per message
			setTimeout(() => {
					axios.delete('http://localhost:8080/messages/' + res.data.message.receiptHandle)
					.catch((error) => {
						console.error(error)
					})
			}, 3000);
		}
		else {
			console.log("No elements currently available for processing");
		}
	})
	.catch((error) => {
		console.log(error);
	});
}, 1000);
