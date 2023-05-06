import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const response = await axios.get("/api/messages");
    setMessages(response.data);
  }

  async function postMessage(messageText) {
    const [action, ...params] = messageText.split(" ");
    const tool_params = {}; // Initialize an empty object to store the parameters

    // Process the params and add them to the tool_params object
    params.forEach((param) => {
      const [key, value] = param.split(":");
      tool_params[key] = value;
    });

    const response = await axios.post("/api/action", {
      action: action,
      tool_params: tool_params,
    });

    // Update the messages state with the new message
    setMessages([...messages, { id: messages.length, text: messageText }]);
  }

  return (
    <div>
      <h1>My App</h1>
      <MessageList messages={messages} />
      <MessageForm onSubmit={postMessage} />
    </div>
  );
}

export default App;
