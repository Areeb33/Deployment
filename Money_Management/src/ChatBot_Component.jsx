import React, { useState } from "react";
import "./ChatBot.css";
function ChatBot_Component() {
  const [input, setInput] = useState("");
  const [chatArray, setChatArray] = useState([]);
  const [key, setKey] = useState("");

  const askAI = async () => {
    if (!input) return;

    setChatArray((prev) => [...prev, { type: "input", content: input }]);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: input,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const response = data.choices[0].message.content;

      setChatArray((prev) => [...prev, { type: "output", content: response }]);
    } catch (error) {
      console.error(error);
      setChatArray((prev) => [
        ...prev,
        { type: "output", content: "Something went wrong. Check the console." },
      ]);
    }

    setInput("");
    console.log(chatArray);
  };

  return (
    <div className="main">
      <h1>Mini Ai Tool</h1>
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter a valid api key"
        className="apiInput"
      />
      <div className="chat-history">
        {chatArray.map((msg, idx) => (
          <div
            className={msg?.type === "input" ? `userInput` : `aiInput`}
            key={idx}
          >
            <strong>{msg.type === "input"}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chatandbutt">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="chatArea"
          onkeydown="if(event.key==='Enter') document.getElementById('btn').click()"
        />
        <button id="btn" className="send" onClick={askAI}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot_Component;
