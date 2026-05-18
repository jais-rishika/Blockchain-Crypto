// redisClient.js
const { createClient } = require('redis');

function createRedisClient() {
  const client = createClient({
    // username: 'default',
    // password: process.env.REDIS_PASSWORD,
    // socket: {
    //   host: process.env.REDIS_HOST,
    //   port: Number(process.env.REDIS_PORT),
    //   tls: true // keep true since your test worked
    // }
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  return client;
}

module.exports = { createRedisClient };