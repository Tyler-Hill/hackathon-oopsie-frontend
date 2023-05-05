const express = require("express");
const bodyParser = require("body-parser");
const openai = require("openai");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

openai.apiKey = process.env.OPENAI_KEY;

async function questionInterpreter(json) {
  const interpretation = await openai.ChatCompletion.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You help translate a JSON file into a question to a user." + "The JSON will contain information of why the user is being notified" + "And you need to ask that question to the user directly. Your task is to help the user" + "decide what action to take. End with 'what should we do?' ",
      },
      {
        role: "user",
        content: `${JSON.stringify(json)}`,
      },
    ],
    temperature: 0,
  });

  return interpretation.choices[0].message.content;
}

async function finalAnswer(history) {
  const interpretation = await openai.ChatCompletion.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: " You have to extract the final action that needs to be taken" + "out of the context provided to you." + "The only available options are: cancel_order, send_email, read_history, other " + `''' full conversation: ${history} '''`,
      },
    ],
    temperature: 0,
  });

  return interpretation.choices[0].message.content;
}

// Implement your pick_tool function here
function pickTool(context) {
  // ...
}

app.post("/", async (req, res) => {
  const postData = req.body;
  console.log(postData);

  const question = await questionInterpreter(postData);
  const decision = await axios.post("http://localhost:8000/user-input", { question });

  const context = question + decision.data.answer;
  const answer = await finalAnswer(context);

  const finalOutcome = pickTool(context);
  console.log(finalOutcome);

  res.status(200).send(answer);
});

const server = app.listen(8001, () => {
  console.log("Running server on port 8001...");
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close();
  process.exit();
});
