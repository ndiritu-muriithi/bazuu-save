import { useState } from 'react';

export default function WalletConnect({ setAccount }) {
  const [address, setAddress] = useState(null);

  const connect = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setAccount(accounts[0]);
    }
  };

  return (
    <div>
      {address ? (
        <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}