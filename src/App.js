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
    const response = await axios.post("/api/messages", {
      text: messageText,
    });
    setMessages([...messages, response.data]);
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
