import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function EventHistory({ contract, account }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (contract) {
      const filterDeposited = contract.filters.Deposited(account);
      const filterWithdrawn = contract.filters.Withdrawn(account);
      contract.queryFilter(filterDeposited).then((deps) => {
        contract.queryFilter(filterWithdrawn).then((wds) => {
          const allEvents = [
            ...deps.map((e) => ({
              type: 'Deposited',
              user: e.args.user,
              amount: ethers.utils.formatUnits(e.args.amount, 6),
              timestamp: e.args.timestamp.toNumber(),
            })),
            ...wds.map((e) => ({
              type: 'Withdrawn',
              user: e.args.user,
              amount: ethers.utils.formatUnits(e.args.amount, 6),
              timestamp: e.args.timestamp.toNumber(),
            })),
          ];
          allEvents.sort((a, b) => b.timestamp - a.timestamp);
          setEvents(allEvents);
        });
      });
      contract.on('Deposited', (user, amount, timestamp) => {
        if (user.toLowerCase() === account.toLowerCase()) {
          setEvents((prev) => [
            { type: 'Deposited', user, amount: ethers.utils.formatUnits(amount, 6), timestamp: timestamp.toNumber() },
            ...prev,
          ]);
        }
      });
      contract.on('Withdrawn', (user, amount, timestamp) => {
        if (user.toLowerCase() === account.toLowerCase()) {
          setEvents((prev) => [
            { type: 'Withdrawn', user, amount: ethers.utils.formatUnits(amount, 6), timestamp: timestamp.toNumber() },
            ...prev,
          ]);
        }
      });
    }
  }, [contract, account]);

  return (
    <div>
      <h3>Event History</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.type}: {event.amount} USDC at {new Date(event.timestamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}