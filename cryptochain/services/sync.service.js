const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

export const syncWithRootState = async ({ blockchain, transactionPool }) => {
  try {
    // sync blockchain
    const resBlockChain = await fetch(`${ROOT_NODE_ADDRESS}/api/block`);
    if (!resBlockChain.ok) throw new Error(`HTTP ${resBlockChain.status}`);

    const rootChain = await resBlockChain.json();
    console.log('replace chain on sync with ', rootChain);
    blockchain.replaceChain(rootChain);

    // sync transaction pool
    const resPool = await fetch(`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`);
    if (!resPool.ok) throw new Error(`HTTP ${resPool.status}`);

    const rootPool = await resPool.json();
    console.log('replace transaction pool map on sync with ', rootPool);

    // expecting { type:'success', data: {...} }
    transactionPool.setMap(rootPool.data);
  } catch (error) {
    console.log('Some Error Occured:', error);
  }
};
