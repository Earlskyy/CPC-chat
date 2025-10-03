import { useState } from "react";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import "./index.css";


function App() {
  const [userData, setUserData] = useState(null);

  return userData ? (
    <Chat
      username={userData.username}
      course={userData.course}
      onStop={() => setUserData(null)}
    />
  ) : (
    <Landing
      onStart={(username, course) => setUserData({ username, course })}
    />
  );
}

export default App;
