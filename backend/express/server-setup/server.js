const express = require ('express');
const mongoose = require ('moongoose');
const cors = require ('cors');
const axios = require ('axios');
const { ethers } = require ('ethers');

//env variables
require ('dotenv').config ();
const app = express ( );

//Middleware
app.use(cors);
app.use.apply(express.json());

// connect network
const provider = 

// Contract instance 
const contractAddress = '0xYOUR_CONTRACT_ADDRESS'; // e.g., 0x123... (from Remix)
const contractABI = [ /* Paste your ABI JSON here from Remix */ ]; // From Remix "Compile" tab
const contract = new ethers.Contract(contractAddress, contractABI, provider);


// API routes
//API endpoint to get the balance of a specific address
app.get('/api/health', async (req, res) => {
    try {
        const blockNumber = await provider.getBlockNumber();
        res.json({
            status: 'OK',
            server: 'Running',
            blockchain: `Connected (Block: ${blockNumber})`
            });
        } catch (error) {
       res.status(500).json({
        status: 'ERROR',
        server: 'Running',
        blockchain: 'Disconnected',
        error: error.message
    });
}
});

// 8. API Endpoint: GET /api/balance - Fetches a user’s current savings balance from the contract.
app.get('/api/balance', async (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.status(400).json({ error: 'Address required' });
    }
    try {
        const balance = await contract.savings(address);
        const formattedBalance = ethers.utils.formatUnits(balance, 6);
        res.json({ balance: formattedBalance });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch balance', details: error.message });
    }
});     
// 9. API Endpoint: GET /api/events - Retrieves recent Deposited and Withdrawn events.
// This gives the frontend a history of savings actions.

app.get('/api/events', async (req, res) => {
    const userFilter = req.query.user;
    try {
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 1000;
        const depositedEvents = await contract.queryFilter('Deposited', fromBlock, currentBlock);
        const withdrawnEvents = await contract.queryFilter('Withdrawn', fromBlock, currentBlock);
        const allEvents = [
            ...depositedEvents.map(event => ({
                user: event.args.user, // Who deposited.
                amount: ethers.utils.formatUnits(event.args.amount, 6), // Amount in USDC.
                type: 'Deposited', // What happened.
                timestamp: (await provider.getBlock(event.blockNumber)).timestamp // When it happened.
            })),
            ...withdrawnEvents.map(event => ({
                user: event.args.user, // Who withdrew.
                amount: ethers.utils.formatUnits(event.args.amount, 6), // Amount in USDC.
                type: 'Withdrawn', // What happened.
                timestamp: (await provider.getBlock(event.blockNumber)).timestamp // When it happened.
            }))
        ];

        // Apply user filter if provided (case-insensitive).
        const filteredEvents = userFilter 
            ? allEvents.filter(event => event.user.toLowerCase() === userFilter.toLowerCase())
            : allEvents;
      res.json(filteredEvents.length > 0 ? filteredEvents : []);
    } catch (error) {
         res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
});
        


app.get('/', (req, res) => {
    console.log("Here is the response")

    res.send ('bazuu-save Backend');
});

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log('Server running on port ${PORT}');
});