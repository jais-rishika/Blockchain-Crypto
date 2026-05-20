import { createClient } from 'redis';


function createRedisClient() {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  return client;
}

export default createRedisClient;