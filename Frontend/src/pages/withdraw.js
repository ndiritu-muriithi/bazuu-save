import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const contractAddress = '0xYOUR_CONTRACT_ADDRESS';
const contractABI = require('../abi.json');

export default function Withdraw() {
  const [lockTime, setLockTime] = useState(0);

  useEffect(() => {
    const fetchLockTime = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const time = await contract.getLockTime(await signer.getAddress());
      setLockTime(time.toNumber());
    };
    fetchLockTime();
  }, []);

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.withdraw();
  };

  return (
    <div>
      <h1>Withdraw Savings</h1>
      <p>Unlock Time: {new Date(lockTime * 1000).toLocaleString()}</p>
      <button onClick={withdraw}>Withdraw</button>
      <a href="/">Back</a>
    </div>
  );
}