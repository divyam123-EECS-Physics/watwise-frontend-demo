import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import "./Sidebar.css";

type ChatMessage = {
  role: "user" | "bot";
  content: string;
  createdAt: number;
};

interface SidebarProps {
  analysisEvent?: { id: number; text: string };
}

function downloadTxt(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Sidebar({ analysisEvent }: SidebarProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, createdAt: Date.now() },
    ]);
    setMessage("");
  };

  useEffect(() => {
    if (!analysisEvent || analysisEvent.id === 0) return;
    const trimmed = analysisEvent.text?.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: trimmed, createdAt: Date.now() },
    ]);
  }, [analysisEvent?.id, analysisEvent?.text]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const chatTxt = useMemo(() => {
    if (messages.length === 0) return "";
    return messages
      .map((m) => `${m.role === "bot" ? "LLM" : "User"}:\n${m.content}\n`)
      .join("\n---\n\n");
  }, [messages]);

  const handleDownloadTxt = () => {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const content = chatTxt || "No chat content yet.";
    downloadTxt(content, `wattwise_chat_${stamp}.txt`);
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
          {messages.map((msg) => (
            <div
              key={`${msg.role}-${msg.createdAt}`}
              className={`sidebar__chat-bubble ${
                msg.role === "bot" ? "sidebar__chat-bubble--bot" : "sidebar__chat-bubble--user"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
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

        <button
          type="button"
          className="sidebar__chat-download"
          onClick={handleDownloadTxt}
        >
          Download TXT
        </button>
      </div>
    </aside>
  );
}
