import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import CheckId from "./routes/CheckId";
import Register from "./routes/Register";
import PwChange from "./routes/PwChange";
import Main from "./routes/Main";
import Quiz from "./routes/Quiz";
import Posting from "./routes/Posting";
import Story from "./routes/Story";
import Code from "./routes/Code";
import Signin from "./routes/Signin";
import "./App.css";
import Landing from "./routes/Landing";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CheckId />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/pwchange" element={<PwChange />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/main" element={<Story />} />
          <Route path="/code" element={<Code />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/posting" element={<Posting />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
