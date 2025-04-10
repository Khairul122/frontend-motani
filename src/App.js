import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; 
import DaftarKonsumen from './DaftarKonsumen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daftar-konsumen" element={<DaftarKonsumen />} />
      </Routes>
    </Router>
  );
}

export default App;
