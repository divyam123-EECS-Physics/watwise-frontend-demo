import { useState, type FormEvent } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, trimmed]);
    setMessage("");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__report">
        <h3 className="sidebar__report-heading">Report Analysis</h3>
        <p className="sidebar__report-text">
          Initial report analysis text. This section provides a summary of the
          water usage data across all monitored zones. Key trends include
          increasing consumption during summer months and above-average flow
          rates in the eastern district.
        </p>
      </div>

      <div className="sidebar__chat">
        <div className="sidebar__chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className="sidebar__chat-bubble">{msg}</div>
          ))}
        </div>
        <form className="sidebar__chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="sidebar__chat-input"
            placeholder="Ask a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="sidebar__chat-send">
            Send
          </button>
        </form>
      </div>
    </aside>
  );
}
