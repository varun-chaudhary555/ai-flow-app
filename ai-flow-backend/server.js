const express = require("express")
const cors = require("cors");
const axios = require("axios");
const mongoose =require("mongoose")
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/ai-flow")
.then(()=>{console.log("Database is connected........")})
.catch((err)=>{console.log(err)})

const flowSchema=mongoose.Schema({
     prompt: String,
  response: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Flow=mongoose.model("Flow",flowSchema)

const app =express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    try{
        res.send("API is running...........")
    }catch(err){
        console.log(err)
    }
})

// POST for getting response

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST for saving response

app.post("/api/save",async(req,res)=>{
    try {
    const { prompt, response } = req.body;

    const newData = new Flow({ prompt, response });
    await newData.save();

    res.json({ message: "Saved successfully" });

  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
})

const PORT=5000

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})