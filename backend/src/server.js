// src/server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors()); // Allows requests from the React frontend
app.use(bodyParser.json()); // Parses JSON data sent in requests

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// WhatsApp OTP Route
app.post("/api/send-whatsapp-otp", async (req, res) => {
  const { phoneNumber, code } = req.body;

  try {
    const message = await twilioClient.messages.create({
      body: `Your OTP is: ${code}`,
      from: "whatsapp:+14155238886", // Twilio WhatsApp sandbox number
      to: `whatsapp:${phoneNumber}`,
    });

    res.json({ success: true, message: message.sid });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
