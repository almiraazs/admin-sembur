// src/pages/Product/ProductPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AlatSatuanPage from './AlatSatuanPage';
import AlatKelompokPage from './AlatKelompokPage'; // <-- Import AlatKelompokPage

// Komponen Konten Utama Produk
// Tidak ada props database (misal: supabase/db/auth/userId) karena kita kembali ke localStorage
const ProductContent = ({ productType }) => {
  const getTypeName = (type) => {
    if (type === 'satuan') return 'Alat Satuan';
    if (type === 'kelompok') return 'Alat Kelompok';
    return '';
  };

  if (!productType) {
    return (
      <div className="flex-1 p-8 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-500">
        Pilih jenis produk dari menu di atas untuk melihat daftar.
      </div>
    );
  }

  // Render komponen sesuai dengan productType
  if (productType === 'satuan') {
    // Tidak ada prop database yang diteruskan
    return <AlatSatuanPage />;
  } else if (productType === 'kelompok') {
    // Tidak ada prop database yang diteruskan
    return <AlatKelompokPage />; // <-- Render AlatKelompokPage
  } else {
    return (
      <div className="flex-1 p-8 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-500">
        Jenis produk tidak valid.
      </div>
    );
  }
};


// Halaman Product Utama
// Tidak ada props database (misal: supabase/db/auth/userId) di sini
const ProductPage = () => {
  const { productType } = useParams();
  const navigate = useNavigate();

  const handleMenuClick = (type) => {
    navigate(`/product/${type}`);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Manajemen Produk</h1>

      {/* Menu Pilihan Alat Satuan/Kelompok */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={() => handleMenuClick('satuan')}
          className={`p-3 rounded-md text-sm font-medium transition duration-200 ${
            productType === 'satuan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alat Satuan
        </button>
        <button
          onClick={() => handleMenuClick('kelompok')}
          className={`p-3 rounded-md text-sm font-medium transition duration-200 ${
            productType === 'kelompok' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alat Kelompok
        </button>
      </div>

      {/* ProductContent akan merender AlatSatuanPage atau AlatKelompokPage */}
      {/* Tidak ada prop database yang diteruskan */}
      <ProductContent productType={productType} />
    </div>
  );
};

export default ProductPage;
