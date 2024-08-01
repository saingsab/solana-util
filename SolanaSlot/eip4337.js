const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/MKZ6vv1Gwj-q6-URNCPQ8m3RvkFIV2Jl');
const entryPointContractAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'; // Replace with the actual address
const entryPointContractAbi = "./abi.json";

const entryPointContract = new ethers.Contract(entryPointContractAddress, entryPointContractAbi, provider);

const blockNumber = 6415077; // Replace with your desired block number

async function getEIP4337Transactions(blockNumber) {
  const block = await provider.getBlock(blockNumber);
  const blockTransactions = await provider.getBlockWithTransactions(blockNumber);

  // Filter for EIP-4337 transactions by checking if the to address is the Entry Point contract
  const eip4337Transactions = blockTransactions.transactions.filter(tx => tx.to === entryPointContractAddress);

  // Process each EIP-4337 transaction
  for (const tx of eip4337Transactions) {
    const transactionReceipt = await provider.getTransactionReceipt(tx.hash);
    const userOperation = transactionReceipt.logs.find(log => log.address === entryPointContractAddress && log.topics[0] === ethers.utils.id('UserOperationStarted(address,uint256,bytes,bytes,bytes)'));

    if (userOperation) {
      // Decode userOperation data using ABI
      const decodedUserOperation = ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'bytes', 'bytes', 'bytes'], userOperation.data.slice(4));

      // Extract relevant data from decodedUserOperation
      const sender = decodedUserOperation[0];
      const nonce = decodedUserOperation[1];
      // ... other fields ...

      console.log('Sender:', sender);
      console.log('Nonce:', nonce);
      // ... other data ...
    }
  }
}

getEIP4337Transactions(blockNumber);
