import { useState } from "react";

function Landing({ onStart }) {
  const [username, setUsername] = useState("");
  const [course, setCourse] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleStart = () => {
    if (!username || !course) {
      alert("Please enter your username and select a course.");
      return;
    }
    if (!agreed) {
      alert("You must agree to the disclaimer and terms before continuing.");
      return;
    }
    onStart(username, course);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('./CPCSchool.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-800/70"></div>

      {/* Card Content */}
      <div className="relative bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center border border-white/30">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
          CPC CHAT HUB
        </h1>

        {/* Intro */}
        <p className="text-white/90 text-sm mb-4 leading-relaxed">
          <span className="font-semibold">What is CPC Chat Hub?</span><br />
          CPC Chat Hub is an anonymous chat platform for Cordova Public College
          students. Connect with classmates, share knowledge, and build
          friendships across departments.
        </p>

        {/* Disclaimer box */}
        <div className="bg-white/80 border border-gray-300/50 rounded-lg p-3 h-28 overflow-y-auto text-xs text-left text-gray-700 mb-4">
          <p className="mb-1 font-semibold">Disclaimer & Terms:</p>
          <p>• This platform is for educational and social interaction only.</p>
          <p>• Do not share sensitive, offensive, or inappropriate content.</p>
          <p>• Misuse of this app may result in restrictions or reporting.</p>
          <p>• By continuing, you agree to these Terms & Conditions.</p>
        </div>

        {/* Agreement */}
        <div className="flex items-center justify-start gap-2 mb-4 text-sm text-white">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="agree">I agree to the disclaimer & terms</label>
        </div>

        {/* Username input */}
        <input
          type="text"
          placeholder="Enter username"
          className="w-full px-4 py-3 rounded-xl border border-gray-300/50 bg-white/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition mb-3"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Course selection */}
        <select
          className="w-full px-4 py-3 rounded-xl border border-gray-300/50 bg-white/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition mb-6"
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course/Dept</option>
          <option value="BSIT">BSIT</option>
          <option value="BSEd">BSEd</option>
          <option value="BEEd">BEEd</option>
          <option value="BSHM">BSHM</option>
        </select>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!agreed}
          className={`w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition transform hover:scale-[1.02] ${
            agreed
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          🚀 Start Chatting
        </button>
      </div>
    </div>
  );
}

export default Landing;
