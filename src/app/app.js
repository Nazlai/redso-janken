import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "routes";
import { auth } from "firebaseUtils";

const App = () => {
  useEffect(() => {
    auth.signInAnonymously();
  }, []);

  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default App;
