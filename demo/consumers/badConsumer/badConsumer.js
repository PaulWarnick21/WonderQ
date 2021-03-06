const axios = require('axios');

/*
	This is an example of a consumer that fails to process the
	messages it receives. This will cause WonderQ to reach the
	visibilityTimeout for a message and allow it to be processed
	by other consumers.
*/
setInterval(() => {
	axios.get('http://localhost:8080/messages')
	.then((res) => {
		if (res.data.message == null) {
			console.log("No elements currently available for processing");
		}
	})
	.catch((error) => {
		console.log(error);
	});
}, 1000);
