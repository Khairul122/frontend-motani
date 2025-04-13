import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; 
import DaftarKonsumen from './DaftarKonsumen';
import DataUser from './DataUser';
import Informasi from './Informasi';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daftar-konsumen" element={<DaftarKonsumen />} />
        <Route path="/data-user" element={<DataUser />} />
        <Route path="/informasi" element={<Informasi />} />
      </Routes>
    </Router>
  );
}

export default App;
