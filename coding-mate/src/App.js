import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import CheckId from "./routes/CheckId";
import PwChange from "./routes/PwChange";
import Quiz from "./routes/Quiz";
import Story from "./routes/Story";
import Code from "./routes/Code";
import Signin from "./routes/Signin";
import "./App.css";
import Landing from "./routes/Landing";
import ForgetPw from "./routes/ForgetPw";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CheckId />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgetpw" element={<ForgetPw />} />
          <Route path="/pwchange" element={<PwChange />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/main" element={<Story />} />
          <Route path="/code" element={<Code />} />
          <Route path="/quiz" element={<Quiz />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}