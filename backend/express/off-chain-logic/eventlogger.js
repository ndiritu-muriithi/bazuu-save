const mongoose = require("mongoose");
await mongoose.connect("mongodb://localhost:27017/bazuu_save");

const EventSchema = new mongoose.Schema({
  type: String, // "Deposited" or "Withdrawn"
  user: String,
  amount: String,
  interest: String,
  timestamp: { type: Date, default: Date.now },
  txHash: String,
});

const EventLog = mongoose.model("EventLog", EventSchema);

// Log event
async function logEvent(event, txHash) {
  const log = new EventLog({
    type: event.event,
    user: event.args.user,
    amount: event.args.amount.toString(),
    interest: event.args.interest?.toString() || "0",
    txHash,
  });
  await log.save();
}

// Listen to events
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const contract = new ethers.Contract(CONTRACT_ADDRESS, BazuuSave_ABI, provider);
contract.on("Deposited", (user, amount, event) => logEvent(event, event.transactionHash));
contract.on("Withdrawn", (user, amount, interest, event) => logEvent(event, event.transactionHash));