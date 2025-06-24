// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/Product/ProductPage';
import PaymentPage from './pages/Payment/PaymentPage'; // PaymentPage DIIMPOR DAN DIGUNAKAN
import { Bars3Icon } from '@heroicons/react/24/outline';

// Pastikan TIDAK ADA import terkait Supabase/Firebase di sini, karena fokus ke tampilan saja

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Tidak ada loading state dari database eksternal
  const loadingApp = false;

  if (loadingApp) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="w-full flex-1 flex flex-col lg:ml-64 transition-all duration-300">
          <header className="bg-white p-4 shadow-md flex items-center justify-between lg:hidden">
            <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:text-gray-900">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
            <div></div>
          </header>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:productType" element={<ProductPage />} />
              {/* PaymentPage di-render di sini, tanpa props database */}
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
