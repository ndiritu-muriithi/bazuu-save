const axios = require("axios");

async function mpesaDeposit(phone, amount) {
  const response = await axios.post("MPESA_API_URL", {
    phoneNumber: phone,
    amount: amount,
    // Auth tokens & callbacks
  });
  // Convert to USDC via on-ramp (below) and call deposit
}

const twilio = require("twilio");
const client = twilio("ACCOUNT_SID", "AUTH_TOKEN");

async function sendSMS(to, message) {
  await client.messages.create({
    body: message,
    from: "YOUR_TWILIO_NUMBER",
    to: to,
  });
}

// Example usage
contract.on("Deposited", async (user, amount) => {
  await sendSMS("+254...", `Deposit of ${amount} USDC confirmed!`);
});
