import { createClient } from 'redis';

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class Pubsub {
    constructor({ blockchain,transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool=transactionPool;

        // Use your cloud config or REDIS_URL
        this.publisher = createClient({ url: process.env.REDIS_URL });
        this.subscriber = this.publisher.duplicate();

        this.publisher.on('error', (err) => console.log('Redis Publisher Error', err));
        this.subscriber.on('error', (err) => console.log('Redis Subscriber Error', err));
    }

    async connect() {
        await this.publisher.connect();
        await this.subscriber.connect();

        this.subscribeToChannels();

        console.log('✅ Redis PubSub connected & subscribed');
    }

    handleMessage(channel, message) {
        console.log(`Message received. ${channel}: ${message}`);
        const parsedMessage = JSON.parse(message);

        switch (channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(
                    parsedMessage,
                    true,
                    ()=> this.transactionPool.clearBlockChainTransaction({chain: parsedMessage})
                );
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                console.log("Unknown Channel");
                return;
        }
    }

    async publish({ channel, message }) {
        // 1) unsubscribe
        await this.subscriber.unsubscribe(channel);

        // 2) publish (no callback in v4)
        const receivers = await this.publisher.publish(channel, message);

        // 3) resubscribe with the SAME handler callback
        await this.subscriber.subscribe(channel, (msg) => {
            this.handleMessage(channel, msg);
        });

        return receivers;
    }

    broadcastBlockChain() {
        return this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        return this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(async (channel) => {
                await this.subscriber.subscribe(channel, (message) => {
                this.handleMessage(channel, message);
            });
        })
    }
}

export default Pubsub;