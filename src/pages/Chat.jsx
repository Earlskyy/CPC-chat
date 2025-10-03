import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

function Chat({ username, course, onStop }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const socket = io("https://cpc-chat-backend-1.onrender.com/");
    socketRef.current = socket;

    socket.emit("joinQueue", { username, course });

    socket.on("message", ({ sender, text, highlight }) => {
      setMessages((prev) => [
        ...prev,
        { sender, text, self: sender === username, highlight },
      ]);
    });

    socket.on("typing", (user) => {
      if (user !== username) setTypingUser(user);
    });

    socket.on("stopTyping", () => setTypingUser(null));

    return () => {
      socket.disconnect();
    };
  }, [username, course]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socketRef.current.emit("message", message);
      socketRef.current.emit("stopTyping");
      setMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socketRef.current.emit("typing");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping");
    }, 1200);
  };

  const handleNext = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("leaveChat");

    setMessages([
      { sender: "System", text: "⏳ Searching for a new partner...", highlight: false },
    ]);
    setTypingUser(null);

    setTimeout(() => {
      socketRef.current.emit("joinQueue", { username, course });
    }, 200);
  };

  const handleStop = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("leaveChat");
    onStop();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 font-semibold text-center shadow-lg">
        💬 Chatting as <span className="font-bold">{username}</span> ({course})
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm
              ${m.sender === "System"
                ? m.highlight
                  ? "bg-yellow-100 text-yellow-800 font-semibold text-center mx-auto"
                  : "bg-transparent text-gray-500 text-center italic mx-auto"
                : m.self
                ? "bg-blue-600 text-white self-end rounded-br-md ml-auto"
                : "bg-white text-gray-800 self-start rounded-bl-md border border-gray-200"
              }`}
          >
            {m.sender !== "System" && !m.self && (
              <span className="font-semibold mr-1">{m.sender}: </span>
            )}
            {m.text}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="text-sm text-gray-500 italic ml-2 animate-pulse">
            {typingUser} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls */}
      <div className="flex items-center gap-2 border-t border-gray-300 bg-white p-3 shadow-inner">
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-md transition transform hover:scale-105"
        >
          ➤
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 p-3 border-t border-gray-200 bg-gray-100 shadow-inner">
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold shadow-md transition transform hover:scale-[1.02]"
        >
          ⏭ Next
        </button>
        <button
          onClick={handleStop}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-md transition transform hover:scale-[1.02]"
        >
          ⛔ Stop
        </button>
      </div>
    </div>
  );
}

export default Chat;
