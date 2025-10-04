import { useState } from "react";

function Landing({ onStart }) {
  const [username, setUsername] = useState("");
  const [course, setCourse] = useState("");
  const [agreed, setAgreed] = useState(false);


  const courseLogos = {
    BSIT: "./bsit_logo-removebg-preview.png", 
    BSEd: "./bsedlogo-removebg-preview.png", 
    BEEd: "./beed_logo-removebg-preview.png", 
    BSHM: "./bshm_logo-removebg-preview.png", 
  };

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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-gray-200 px-4">
      {/* Card Content */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-500">
          CPC Chat Hub
        </h1>

        {/* Intro */}
        <p className="text-gray-400 text-sm text-center mb-6">
          An <span className="text-gray-200 font-semibold"> anonymous chat platform </span> 
          for Cordova Public College students.  
          Connect, share knowledge, and make friends across departments.
        </p>

        {/* Disclaimer box */}
        <div className="bg-[#111] border border-gray-700 rounded-lg p-3 h-28 overflow-y-auto text-xs text-gray-400 mb-4">
          <p className="mb-1 text-gray-300 font-semibold">Disclaimer & Terms:</p>
          <p>• For educational & social use only.</p>
          <p>• No offensive, harmful, or sensitive content.</p>
          <p>• Misuse may lead to restrictions or reporting.</p>
          <p>• By continuing, you agree to these Terms.</p>
        </div>

        {/* Agreement */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 bg-[#1a1a1a]"
          />
          <label htmlFor="agree" className="text-gray-300">
            I agree to the disclaimer & terms
          </label>
        </div>

        {/* Username input */}
        <input
          type="text"
          placeholder="Enter username"
          className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-700 bg-[#111] text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Course selection */}
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#111] text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course/Dept</option>
          <option value="BSIT">BSIT</option>
          <option value="BSEd">BSEd</option>
          <option value="BEEd">BEEd</option>
          <option value="BSHM">BSHM</option>
        </select>

        {/* Show Logo */}
        {course && courseLogos[course] && (
          <div className="flex justify-center my-4">
            <img
              src={courseLogos[course]}
              alt={`${course} logo`}
              className="w-20 h-20 object-contain rounded-lg shadow-md border border-gray-700 bg-[#0f0f0f] p-2"
            />
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!agreed}
          className={`w-full py-3 mt-4 rounded-lg font-medium text-sm transition ${
            agreed
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          🚀 Start Chatting
        </button>
      </div>
    </div>
  );
}

export default Landing;
