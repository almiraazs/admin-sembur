// src/pages/Product/AlatKelompokPage.jsx
import React, { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'; // Untuk ikon edit dan hapus

const AlatKelompokPage = () => {
  // State untuk daftar produk
  const [products, setProducts] = useState(() => {
    // Memuat data dari localStorage saat inisialisasi, menggunakan kunci berbeda
    const savedProducts = localStorage.getItem('alatKelompokProducts'); // <-- Kunci localStorage berbeda
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  // State untuk form input
  const [formData, setFormData] = useState({
    id: null,
    namaProduk: '',
    gambar: '', // URL gambar atau Base64
    gambarFile: null, // Objek File gambar
    harga: '',
    deskripsi: '',
  });

  const [imagePreview, setImagePreview] = useState(null); // State untuk pratinjau gambar

  // State untuk pesan error validasi form
  const [errors, setErrors] = useState({});

  // State untuk status operasi (opsional, untuk UI tombol)
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Untuk pesan error umum (misal: gagal konversi file)

  // Simpan data ke localStorage setiap kali 'products' berubah
  useEffect(() => {
    localStorage.setItem('alatKelompokProducts', JSON.stringify(products)); // <-- Kunci localStorage berbeda
  }, [products]);

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle perubahan input file gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Batasi ukuran file hingga 2MB (opsional tapi disarankan)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, gambar: 'Ukuran gambar maksimal 2MB.' }));
        setImagePreview(null);
        setFormData((prevData) => ({ ...prevData, gambarFile: null }));
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        gambar: '', // Reset gambar jika ada URL sebelumnya
        gambarFile: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set pratinjau dengan Base64
      };
      reader.readAsDataURL(file);
      if (errors.gambar) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.gambar;
          return newErrors;
        });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        gambarFile: null,
      }));
      setImagePreview(null);
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.namaProduk.trim()) newErrors.namaProduk = 'Nama Produk wajib diisi.';
    if (!formData.gambarFile && !formData.gambar && !formData.id) newErrors.gambar = 'Gambar wajib diunggah.';
    if (!formData.harga || isNaN(formData.harga) || parseFloat(formData.harga) <= 0) newErrors.harga = 'Harga harus angka positif.';
    if (!formData.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit form (Tambah/Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset pesan error
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const newProduct = {
        id: formData.id || Date.now(), // Gunakan ID yang ada atau ID baru (timestamp)
        namaProduk: formData.namaProduk,
        gambar: imagePreview || formData.gambar, // Simpan Base64 atau URL jika sudah ada (dari edit)
        harga: parseFloat(formData.harga),
        deskripsi: formData.deskripsi,
      };

      if (formData.id) {
        // Edit produk yang ada
        setProducts(products.map((p) => (p.id === formData.id ? newProduct : p)));
      } else {
        // Tambah produk baru
        setProducts([...products, newProduct]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      setErrorMessage("Gagal menyimpan produk: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit produk
  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      namaProduk: product.namaProduk,
      gambar: product.gambar && product.gambar.startsWith('data:') ? '' : product.gambar,
      gambarFile: null,
      harga: product.harga,
      deskripsi: product.deskripsi,
    });
    setImagePreview(product.gambar);
    setErrors({});
    setErrorMessage('');
  };

  // Handle hapus produk
  const handleDelete = (id) => {
    setErrorMessage('');
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setDeleting(true);
      try {
        setProducts(products.filter((product) => product.id !== id));
        resetForm();
      } catch (error) {
        console.error("Error deleting product:", error);
        setErrorMessage("Gagal menghapus produk: " + error.message);
      } finally {
        setDeleting(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      namaProduk: '',
      gambar: '',
      gambarFile: null,
      harga: '',
      deskripsi: '',
    });
    setImagePreview(null);
    setErrors({});
    setErrorMessage('');
  };

  // Fungsi untuk format harga
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Manajemen Alat Kelompok</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setErrorMessage('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah/Edit Produk Kelompok */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md lg:h-fit lg:sticky lg:top-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {formData.id ? 'Form Edit Produk Kelompok' : 'Form Tambah Produk Kelompok'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="namaProduk" className="block text-gray-700 text-sm font-bold mb-2">
                Nama Produk
              </label>
              <input
                type="text"
                id="namaProduk"
                name="namaProduk"
                value={formData.namaProduk}
                onChange={handleChange}
                // PERBAIKAN DI SINI: gunakan backtick untuk seluruh string
                className={`shadow appearance-none border ${errors.namaProduk ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Masukkan nama produk kelompok"
              />
              {errors.namaProduk && <p className="text-red-500 text-xs italic mt-1">{errors.namaProduk}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="gambar" className="block text-gray-700 text-sm font-bold mb-2">
                Gambar (import dari komputer)
              </label>
              <input
                type="file"
                id="gambar"
                name="gambar"
                accept="image/*"
                onChange={handleImageChange}
                // PERBAIKAN DI SINI: gunakan backtick untuk seluruh string
                className={`block w-full text-sm text-gray-900 border ${errors.gambar ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-gray-50 focus:outline-none`}
              />
              {errors.gambar && <p className="text-red-500 text-xs italic mt-1">{errors.gambar}</p>}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Pratinjau Gambar:</p>
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md shadow-md" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="harga" className="block text-gray-700 text-sm font-bold mb-2">
                Harga
              </label>
              <input
                type="number"
                id="harga"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                // PERBAIKAN DI SINI: gunakan backtick untuk seluruh string
                className={`shadow appearance-none border ${errors.harga ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Masukkan harga"
              />
              {errors.harga && <p className="text-red-500 text-xs italic mt-1">{errors.harga}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="deskripsi" className="block text-gray-700 text-sm font-bold mb-2">
                Deskripsi
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows="4"
                // PERBAIKAN DI SINI: gunakan backtick untuk seluruh string
                className={`shadow appearance-none border ${errors.deskripsi ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Masukkan deskripsi produk kelompok"
              ></textarea>
              {errors.deskripsi && <p className="text-red-500 text-xs italic mt-1">{errors.deskripsi}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Menyimpan...' : (formData.id ? 'Update Produk' : 'Tambah Produk')}
              </button>
              {formData.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel Daftar Produk Kelompok */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Tabel Daftar Alat Kelompok</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada produk alat kelompok yang ditambahkan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4 border-b border-gray-200">No.</th>
                    <th className="py-3 px-4 border-b border-gray-200">Nama Produk</th>
                    <th className="py-3 px-4 border-b border-gray-200">Gambar</th>
                    <th className="py-3 px-4 border-b border-gray-200">Harga (Rp)</th>
                    <th className="py-3 px-4 border-b border-gray-200">Deskripsi</th>
                    <th className="py-3 px-4 border-b border-gray-200">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{index + 1}</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{product.namaProduk}</td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {product.gambar ? (
                          <img src={product.gambar} alt={product.namaProduk} className="w-16 h-16 object-cover rounded-md" />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">
                        {formatCurrency(product.harga)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {product.deskripsi}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-md inline-flex items-center mr-2 transition duration-200"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md inline-flex items-center transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlatKelompokPage;
