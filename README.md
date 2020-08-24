# WonderQ

### Description
WonderQ is a simplified version of [Amazon's SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html). It's is a broker that allows multiple producers to write to it, and multiple consumers to read from it. It runs on a single server. Whenever a producer writes to WonderQ, a message ID is generated and returned as confirmation. Whenever a consumer polls WonderQ for new messages, it gets those messages. These messages should NOT be available for processing by any other consumer that may be concurrently accessing WonderQ.

I've created REST API endpoints for GET, POST, and DELETE for producers and consumers to use to generate and consumer messages from the WonderQ. Please see the [Wiki](https://github.com/PaulWarnick21/WonderQ/wiki) section for further details.

#### Here is an example of a queue message's life cycle in SQS. WonderQ matches this minus distributing the queue onto many servers, but this could be added in the future:

![SQS Message Life Cycle](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/images/sqs-message-lifecycle-diagram.png)


### Further Improvements

Currently WonderQ is a very simple queuing service and there is a lot of room for improvement. As of right now we're only using an in-memory array to store the queue as well as multiple for-loops to iterate through the array. Additionally, each stored message is a custom object which could be redesigned to improve performance. Here are some ideas to increase scalability:

- As a simple but hugely beneficial improvement, we could switch the queue from an array to a hash table. This would eliminate the need to iterate through the queue every time we need to delete a message
  - We could also likely use this to speed up pulling an item from the queue for processing with the complication of trying to find which is the highest priority element that's also unlocked
  - We may be able to use a mutex instead of our custom object to increase efficiency of locking, unlocking and searching through queue items that are currently locked
- Additionally, to increase scalability we would likely want to switch our queue to be stored in a database instead of anything in memory
- The ability for bad consumers to eventually not be able to receive messages anymore if they're constantly failing to process
- There's a number of interesting features provided in Amazon SQS that would be great to implement in WonderQ as well:
  - [Dead-Letter Queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) to help with debugging of constantly failing messages
  - Distributed queue architecture so that the so that we can handle a huge number of requests in a short amount of time if needed
    - With this can come the addition of short and long polling depending on the needs of the app using the queue
  - Variable visibilityTimeouts so that the we can dynamically increase efficiency of the queue depending on current processing time
    
