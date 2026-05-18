import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'WGBV6CSX9A0Zsp4FlURttwRSKl8gYbv1',
    socket: {
        host: 'redis-11232.c245.us-east-1-3.ec2.cloud.redislabs.com',
        port: 11232
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

