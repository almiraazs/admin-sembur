// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'; // Impor useEffect
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  CreditCardIcon,
  XMarkIcon,
  ChevronUpIcon,    // Ikon panah ke atas
  ChevronDownIcon    // Ikon panah ke bawah
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false); // State untuk sub-menu Product

  // Fungsi untuk mengecek apakah link adalah aktif
  const isActive = (path) => location.pathname === path;
  // Fungsi untuk mengecek apakah rute saat ini berada di bawah /product (untuk highlight menu utama)
  const isProductActive = location.pathname.startsWith('/product');

  // Efek samping untuk membuka sub-menu Product secara otomatis
  // jika kita berada di rute yang terkait dengan produk.
  useEffect(() => {
    if (isProductActive) {
      setIsProductSubMenuOpen(true);
    } else {
      // Jika bukan di rute product, tutup sub-menu
      setIsProductSubMenuOpen(false);
    }
  }, [isProductActive]); // Jalankan efek ini setiap kali isProductActive berubah

  // Fungsi untuk mengubah status buka/tutup sub-menu Product
  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  return (
    <>
      {/* Overlay untuk Mobile saat Sidebar Terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`
          flex flex-col h-screen bg-gray-800 text-white w-64 p-4
          fixed inset-y-0 left-0 z-40 shadow-lg
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Tombol Tutup untuk Mobile (di dalam Sidebar) */}
        <div className="flex justify-end lg:hidden">
          <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo/Nama Aplikasi */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1 mt-6">
          <ul>
            <li className="mb-2">
              <Link
                to="/"
                onClick={toggleSidebar}
                className={`flex items-center p-2 rounded-md transition duration-200 ${
                  isActive('/') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>

            <li className="mb-2">
              {/* Product link dengan toggle icon */}
              {/* Div pembungkus untuk menangani klik toggle */}
              <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition duration-200 ${
                  isProductActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={toggleProductSubMenu} // Klik di sini untuk toggle sub-menu
              >
                {/* Link ke halaman Product utama (opsional, bisa dihilangkan jika hanya ingin sub-menu) */}
                <Link
                  to="/product" // Link ini mengarah ke /product
                  onClick={(e) => {
                    e.stopPropagation(); // Mencegah klik link memicu toggleProductSubMenu lagi
                    toggleSidebar(); // Tutup sidebar di mobile setelah navigasi
                  }}
                  className="flex items-center flex-grow" // Memastikan Link mengisi ruang yang tersisa untuk area klik
                >
                  <CubeIcon className="h-5 w-5 mr-3" />
                  Product
                </Link>
                {/* Ikon panah berdasarkan state isProductSubMenuOpen */}
                {isProductSubMenuOpen ? (
                  <ChevronUpIcon className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 ml-2" />
                )}
              </div>

              {/* Sub-menu untuk Product, hanya tampil jika isProductSubMenuOpen true */}
              {isProductSubMenuOpen && (
                <ul className="ml-8 mt-2 space-y-1"> {/* Indentasi untuk sub-menu */}
                  <li>
                    <Link
                      to="/product/satuan"
                      onClick={toggleSidebar} // Tutup sidebar di mobile setelah navigasi
                      className={`block p-2 rounded-md text-sm transition duration-200 ${
                        isActive('/product/satuan') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Alat Satuan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/product/kelompok"
                      onClick={toggleSidebar} // Tutup sidebar di mobile setelah navigasi
                      className={`block p-2 rounded-md text-sm transition duration-200 ${
                        isActive('/product/kelompok') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Alat Kelompok
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mb-2">
              <Link
                to="/payment"
                onClick={toggleSidebar}
                className={`flex items-center p-2 rounded-md transition duration-200 ${
                  isActive('/payment') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <CreditCardIcon className="h-5 w-5 mr-3" />
                Payment
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className="mt-auto border-t border-gray-700 pt-4 text-sm text-gray-500">
          &copy; 2025 Your Company
        </div>
      </div>
    </>
  );
};

export default Sidebar;
