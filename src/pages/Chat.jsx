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
    <div className="flex flex-col h-[100dvh] bg-[#111] text-gray-100 font-sans">
      {/* Header */}
      <div className="bg-[#1c1c1c] text-gray-300 p-4 text-center border-b border-gray-800 text-sm">
        You are chatting as{" "}
        <span className="font-semibold text-blue-400">{username}</span>{" "}
        (<span className="text-green-400">{course}</span>)
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m, i) => {
          const isSystem = m.sender === "System";
          const isConnectedMsg =
            isSystem && m.text.toLowerCase().includes("connected with");

          return (
            <div
              key={i}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                isSystem
                  ? isConnectedMsg
                    ? "border border-blue-500 text-blue-400 font-medium text-center mx-auto rounded-lg bg-[#1a1a1a] shadow-md"
                    : "text-gray-500 text-center italic mx-auto"
                  : m.self
                  ? "bg-blue-600 text-white self-end rounded-br-md ml-auto"
                  : "bg-[#2a2a2a] text-gray-200 self-start rounded-bl-md"
              }`}
            >
              {!isSystem && !m.self && (
                <span className="font-semibold mr-1 text-blue-400">{m.sender}:</span>
              )}
              {m.text}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="text-sm text-gray-400 italic ml-2 animate-pulse">
            {typingUser} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls */}
      <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-800 bg-[#1c1c1c] p-3 pb-[env(safe-area-inset-bottom)]">
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-full text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition"
        >
          ➤
        </button>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 flex gap-2 p-3 border-t border-gray-800 bg-[#1c1c1c] pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleNext}
          className="flex-1 py-2 rounded-md bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-sm transition"
        >
          ⏭ Next
        </button>
        <button
          onClick={handleStop}
          className="flex-1 py-2 rounded-md bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-sm transition"
        >
          ⛔ Stop
        </button>
      </div>
    </div>
  );
}

export default Chat;
