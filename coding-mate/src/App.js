import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import CheckId from "./routes/CheckId";
import PwChange from "./routes/PWChange";
import Story from "./routes/Story";
import Signin from "./routes/Signin";
import "./App.css";
import Landing from "./routes/Landing";
import ForgetPw from "./routes/ForgetPw";
import Dialogue from "./routes/dialogue";

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
          <Route path="/main" element={<Landing />} />
          <Route path="/dialog" element={<Story />} />
          <Route path="/dialogue" element={<Dialogue />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}
