import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnect from '../components/walletconnect';
import SavingsBalance from '../components/savingbalance';
import EventHistory from '../components/eventshistory';

const contractAddress = '0xYOUR_CONTRACT_ADDRESS';
const contractABI = require('../BazuuSave.json');

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (account) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      const sign = prov.getSigner();
      const cont = new ethers.Contract(contractAddress, contractABI, sign);
      setProvider(prov);
      setSigner(sign);
      setContract(cont);
    }
  }, [account]);

  return (
    <div>
      <h1>Bazuu-Save</h1>
      <WalletConnect setAccount={setAccount} />
      {account && (
        <>
          <SavingsBalance contract={contract} account={account} />
          <EventHistory contract={contract} account={account} />
          <a href="/deposit">Deposit</a> | <a href="/withdraw">Withdraw</a>
        </>
      )}
    </div>
  );
}



