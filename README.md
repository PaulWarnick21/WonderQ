# WonderQ

### Description
WonderQ is a simplified version of [Amazon's SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html). It's is a broker that allows multiple producers to write to it, and multiple consumers to read from it. It runs on a single server. Whenever a producer writes to WonderQ, a message ID is generated and returned as confirmation. Whenever a consumer polls WonderQ for new messages, it gets those messages. These messages should NOT be available for processing by any other consumer that may be concurrently accessing WonderQ.

I've created REST API endpoints for GET, POST, and DELETE for producers and consumers to use to generate and consumer messages from the WonderQ. Please see the [Wiki](https://github.com/PaulWarnick21/WonderQ/wiki) section for further details.

#### Here is an example of a queue message's life cycle in SQS. WonderQ matches this minus distributing the queue onto many servers, but this could be added in the future:

![SQS Message Life Cycle](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/images/sqs-message-lifecycle-diagram.png)
