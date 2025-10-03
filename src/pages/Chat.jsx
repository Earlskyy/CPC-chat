import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

function Chat({ username, course, onStop }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("https://cpc-chat-backend-1.onrender.com/");
    socketRef.current = socket;

    // Join queue immediately
    socket.emit("joinQueue", { username, course });

    // Listen for messages
    socket.on("message", ({ sender, text, highlight }) => {
      setMessages((prev) => [
        ...prev,
        { sender, text, self: sender === username, highlight },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, course]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socketRef.current.emit("message", message);
      setMessage("");
    }
  };

  const handleNext = () => {
    if (!socketRef.current) return;

    // Leave current chat
    socketRef.current.emit("leaveChat");

    // Reset UI
    setMessages([
      {
        sender: "System",
        text: "⏳ Searching for a new partner...",
        highlight: false,
      },
    ]);

    // Rejoin queue
    setTimeout(() => {
      socketRef.current.emit("joinQueue", { username, course });
    }, 200); // small delay ensures server processed leave
  };

  const handleStop = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("leaveChat");
    onStop();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 font-semibold text-center shadow-md">
        Chatting as {username} ({course})
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-3 py-1.5 rounded-2xl text-sm break-words leading-snug
              ${m.sender === "System"
                ? m.highlight
                  ? "bg-yellow-100 text-yellow-800 font-semibold text-center mx-auto px-4 py-2 rounded-md shadow"
                  : "bg-transparent text-gray-500 text-center mx-auto italic"
                : m.self
                ? "bg-blue-600 text-white self-end rounded-br-md ml-auto"
                : "bg-gray-200 text-gray-800 self-start rounded-bl-md"
              }`}
          >
            {m.sender !== "System" && !m.self && (
              <span className="font-semibold mr-1">{m.sender}: </span>
            )}
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls */}
      <div className="flex items-center gap-2 border-t border-gray-300 bg-white p-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-11 h-11 flex items-center justify-center text-lg transition"
        >
          ➤
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
        >
          Next
        </button>
        <button
          onClick={handleStop}
          className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default Chat;
