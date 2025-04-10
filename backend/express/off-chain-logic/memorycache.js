const { ethers } = require("ethers");
const redis = require("redis");
const client = redis.createClient({ url: "redis://localhost:6379" });

await client.connect();

// Cache user balance
async function cacheUserBalance(userAddress, contractAddress, usdcAddress) {
  const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
  const usdcContract = new ethers.Contract(usdcAddress, IERC20_ABI, provider);
  const bazuuSaveContract = new ethers.Contract(contractAddress, BazuuSave_ABI, provider);

  const balance = await usdcContract.balanceOf(userAddress);
  const savingsData = await bazuuSaveContract.getBalance(userAddress);

  await client.hSet(`user:${userAddress}`, {
    usdcBalance: balance.toString(),
    savingsAmount: savingsData[0].toString(),
    lockUntil: savingsData[1].toString(),
    active: savingsData[2].toString(),
  });

  return { balance, savingsData };
}

// Retrieve cached balance
async function getCachedBalance(userAddress) {
  const data = await client.hGetAll(`user:${userAddress}`);
  return data;
}
const NodeCache = require("node-cache");
const memoryCache = new NodeCache({ stdTTL: 600 }); // 10-minute TTL

async function cacheToMemory(userAddress, data) {
  memoryCache.set(userAddress, data);
}

async function getFromMemory(userAddress) {
  return memoryCache.get(userAddress) || null;
}

// Fallback logic
async function getBalanceWithFallback(userAddress, contractAddress, usdcAddress) {
  let data = await getCachedBalance(userAddress);
  if (!data.usdcBalance) {
    data = await getFromMemory(userAddress);
    if (!data) {
      data = await cacheUserBalance(userAddress, contractAddress, usdcAddress);
      await cacheToMemory(userAddress, data);
    }
  }
  return data;
}