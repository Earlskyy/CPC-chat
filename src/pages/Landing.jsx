import { useState } from "react";

function Landing({ onStart }) {
  const [username, setUsername] = useState("");
  const [course, setCourse] = useState("");

  const handleStart = () => {
    if (username && course) {
      onStart(username, course);
    } else {
      alert("Please enter your username and select a course.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
          CPC CHAT HUB
        </h1>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition mb-4"
          onChange={(e) => setUsername(e.target.value)}
        />

        <select
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition mb-6"
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course/Dept</option>
          <option value="BSIT">BSIT</option>
          <option value="BSEd">BSEd</option>
          <option value="BEEd">BEEd</option>
          <option value="BSHM">BSHM</option>
        </select>

        <button
          onClick={handleStart}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-lg shadow-md transition transform hover:scale-[1.02]"
        >
          🚀 Start Chatting
        </button>
      </div>
    </div>
  );
}

export default Landing;
