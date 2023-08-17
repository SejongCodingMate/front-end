import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './Login';
import Categories from './Categories';
import Register from './Register';
import PwSearch from './PwSearch';

export default function App() {

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="pwsearch" element={<PwSearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
