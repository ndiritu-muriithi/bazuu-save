import { useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = '0xYOUR_CONTRACT_ADDRESS';
const contractABI = require('../abi.json');
const usdcAddress = '0x0FA8781a83E468F1315b35d04Cdd7e3164E2D4f1';

export default function Deposit() {
  const [amount, setAmount] = useState('');

  const deposit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const usdc = new ethers.Contract(usdcAddress, contractABI, signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const amountWei = ethers.utils.parseUnits(amount, 6);
    await usdc.approve(contractAddress, amountWei);
    await contract.deposit(amountWei);
  };

  return (
    <div>
      <h1>Deposit USDC</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter USDC amount"
      />
      <button onClick={deposit}>Deposit</button>
      <a href="/">Back</a>
    </div>
  );
}