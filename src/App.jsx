// src/App.jsx

import { Routes, Route } from "react-router-dom";

// Components
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Clients from "./components/Clients/Clients";
import Quotes from "./components/Quotes/Quotes";

const App = () => {
  return (
    <>
      <NavBar />

      <Routes>
        {/* Public / Main Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        {/* Dashboard / App Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/quotes" element={<Quotes />} />

        {/* You can add more pages here if needed */}
      </Routes>
    </>
  );
};

export default App;
