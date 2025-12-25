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

const sendMessage = async (userId, message) =>{
  try{
    const body = {
      to: userId,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    };
    const response = await axios.post(`${LINE_BOT_API}/message/push`, body,{headers});
    return response
  }catch(error){
    throw new Error('error : ',error)
  }
}

app.post("/send-message", async (req, res) => {
  try {
    const { userId, message } = req.body
    const response = await sendMessage(userId, message)
    console.log('response',response.data)
    res.json({
        message:"Send message success",
        responseData:response.data
    })
  } catch (error) {
    console.log('error', error.response)
    res.status(500).json({ error: error.message })
  }
});

app.post('/webhook', async (req, res) => {
  const { events } = req.body
  console.log(req.body)
  if(!events || events.lenght == 0){
    res.json({
      message:'No events'
    })
    return false
  }
    
  console.log('events : ',events)
  try {
    const lineEvent = events[0]
    const richMenuForCustomer = process.env.DEFAULT_RICE_MENU_FOR_CUSTOMER
    const richMenuForUser = process.env.DEFAULT_RICE_MENU_FOR_USER
    const userId = lineEvent.source.userId
    
    if(lineEvent.message.text === 'A'){
      const response = await axios.post(`${LINE_BOT_API}/user/${userId}/richmenu/${richMenuForUser}`,{},{headers})
      console.log('response',response.data)
      await sendMessage(userId, 'Welcome for user menu')
    }

    if(lineEvent.message.text === 'B'){
      const response = await axios.post(`${LINE_BOT_API}/user/${userId}/richmenu/${richMenuForCustomer}`,{},{headers})
      console.log('response',response.data)
      await sendMessage(userId, 'Welcome for customer menu')
    }
    console.log('response',response.data)
    
    res.json({
        message:"Send message success",
        responseData:response.data
    })
  } catch (error) {
    console.log('error', error.response)
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`run at http://localhost:${port}`);
});
