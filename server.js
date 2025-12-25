const express = require("express");
const axios = require("axios");
const cors = require("cors")
require("dotenv").config();

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
};

const app = express();

app.use(express.json());
app.use(cors())

const port = "8888";

const LINE_BOT_API = "https://api.line.me/v2/bot";

app.post("/sent-message", async (req, res) => {
  try {
    const {userId, messages } = req.body
    const body = {
      to: userId,
      messages: [
        {
          type: "text",
          text: messages,
        },
      ],
    };
    const response = await axios.post(`${LINE_BOT_API}/message/push`, body,{headers});
    console.log('response',response.data)
    res.json({
        message:"Send message success",
        responseData:response.data
    })
  } catch (error) {
    console.log('error', error.response)
  }
});

app.listen(port, () => {
  console.log(`run at http://localhost:${port}`);
});
