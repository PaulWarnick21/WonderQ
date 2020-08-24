const axios = require('axios');

/*
	Here we're simulating a producer submitting a POST that will add a
	random number between 1 and 1000 for processing by our consumer.
	After we successfully write to WonderQ, we print the MessageID.
*/
setInterval(() => {
	const randomNumber = Math.floor(Math.random() * 1000) + 1;
	axios.post('http://localhost:8080/messages', {
	  message: randomNumber,
	})
	.then((res) => {
		console.log("MessageID: " + res.data.message_id);
	})
	.catch((error) => {
	  console.error(error)
	})
}, 1000);
