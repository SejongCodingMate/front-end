import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './Login';
import Categories from './Categories';
import Register from './Register';
import PwChange from './PwChange';
import Select from './Select';

export default function App() {

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Select />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="pwchange" element={<PwChange />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
