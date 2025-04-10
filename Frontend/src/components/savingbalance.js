import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function SavingsBalance({ contract, account }) {
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      const bal = await contract.getBalance(account);
      setBalance(ethers.utils.formatUnits(bal, 6));
    };
    if (contract) fetchBalance();
  }, [contract, account]);

  return <p>Savings Balance: {balance} USDC</p>;
}