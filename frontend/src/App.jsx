import { useState } from "react";

import LoginModal from "./components/LoginModal/LoginModal";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsLoginOpen(true)}>Login</button>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;
