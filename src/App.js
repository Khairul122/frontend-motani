import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; 
import DaftarKonsumen from './DaftarKonsumen';
import DataUser from './DataUser';
import Informasi from './Informasi';
import Logistik from './Logistik';
import Produk from './Produk';
import Produksi from './Produksi';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daftar-konsumen" element={<DaftarKonsumen />} />
        <Route path="/data-user" element={<DataUser />} />
        <Route path="/informasi" element={<Informasi />} />
        <Route path="/logistik" element={<Logistik />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/produksi" element={<Produksi />} />
      </Routes>
    </Router>
  );
}

export default App;
