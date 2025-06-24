import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

// PENTING: Untuk fungsionalitas PDF, pastikan Anda telah menyertakan CDN untuk jsPDF dan html2canvas
// di file public/index.html proyek React Anda, contoh:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
// Atau, instal pustaka tersebut (npm install jspdf html2canvas) dan import secara langsung.
// Untuk lingkungan Canvas ini, kita asumsikan window.jsPDF dan window.html2canvas tersedia secara global.

const PaymentPage = () => {
  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem('dummyPaymentData');
    if (savedPayments) {
      return JSON.parse(savedPayments);
    }
    return [
      {
        id: 'uuid-1',
        nama_pembeli: 'Budi Santoso',
        nota: 'INV-20250618-001',
        metode_pembayaran: 'QRIS',
        is_paid: true, // Sudah dibayar
        created_at: '2025-06-18T10:00:00Z',
        user_id: 'user123',
        items: [
          { name: 'Alat Pijat Getar', qty: 1, price: 150000 },
          { name: 'Charger Universal', qty: 2, price: 35000 },
        ]
      },
      {
        id: 'uuid-2',
        nama_pembeli: 'Siti Aminah',
        nota: 'INV-20250618-002',
        metode_pembayaran: 'COD',
        is_paid: false, // Belum dibayar
        created_at: '2025-06-18T10:30:00Z',
        user_id: 'user456',
        items: [
          { name: 'Speaker Bluetooth Mini', qty: 1, price: 85000 },
          { name: 'Headset Gaming RGB', qty: 1, price: 210000 },
        ]
      },
      {
        id: 'uuid-3',
        nama_pembeli: 'Joko Susilo',
        nota: 'INV-20250618-003',
        metode_pembayaran: 'QRIS',
        is_paid: false, // Belum dibayar
        created_at: '2025-06-18T11:00:00Z',
        user_id: 'user123',
        items: [
          { name: 'Kabel USB C 2 Meter', qty: 3, price: 25000 },
        ]
      },
      {
        id: 'uuid-4',
        nama_pembeli: 'Dewi Lestari',
        nota: 'INV-20250618-004',
        metode_pembayaran: 'QRIS',
        is_paid: true, // Sudah dibayar
        created_at: '2025-06-18T11:45:00Z',
        user_id: 'user789',
        items: [
          { name: 'Smartwatch Sport', qty: 1, price: 380000 },
          { name: 'Power Bank 10000mAh', qty: 1, price: 120000 },
          { name: 'Case HP Premium', qty: 1, price: 75000 },
        ]
      },
    ];
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('dummyPaymentData', JSON.stringify(payments));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      setErrorMessage("Gagal menyimpan data pembayaran. Memori penuh atau masalah browser.");
    }
  }, [payments]);

  const handleMarkAsPaid = (paymentId) => {
    setErrorMessage('');
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, is_paid: true } : payment
      )
    );
  };

  const handleMarkAsUnpaid = (paymentId) => {
    setErrorMessage('');
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, is_paid: false } : payment
      )
    );
  };

  const handleDelete = (paymentId) => {
    setErrorMessage('');
    if (window.confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
      try {
        setPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== paymentId));
      } catch (error) {
        console.error("Error deleting payment:", error);
        setErrorMessage("Gagal menghapus pembayaran: " + error.message);
      }
    }
  };

  const handleDownloadNotaPdf = async (payment) => {
    setErrorMessage('');
    if (!window.html2canvas || !window.jsPDF) {
      setErrorMessage("Pustaka jsPDF atau html2canvas belum dimuat. Pastikan CDN terpasang di index.html.");
      return;
    }
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '20mm';
    tempDiv.style.backgroundColor = 'white';
    document.body.appendChild(tempDiv);
    const totalAmount = payment.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    tempDiv.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">NOTA PEMBAYARAN</h3>
          <p style="font-size: 12px; color: #555;">Admin Panel</p>
        </div>
        <div style="margin-bottom: 20px; font-size: 14px;">
          <p><strong>Nomor Nota:</strong> ${payment.nota}</p>
          <p><strong>Nama Pembeli:</strong> ${payment.nama_pembeli}</p>
          <p><strong>Metode Pembayaran:</strong> ${payment.metode_pembayaran}</p>
          <p><strong>Status Pembayaran:</strong> ${payment.is_paid ? 'Selesai' : 'Belum Dibayar'}</p>
          <p><strong>Tanggal Transaksi:</strong> ${formatDate(payment.created_at)}</p>
        </div>
        <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ddd;">Detail Produk:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #eee;">Produk</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #eee;">Qty</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Harga Satuan</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${payment.items.map(item => `
              <tr>
                <td style="padding: 8px; text-align: left; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 8px; text-align: left; border-bottom: 1px solid #eee;">${item.qty}</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(item.price)}</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(item.qty * item.price)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">${formatCurrency(totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="text-align: center; font-size: 12px; color: #555; margin-top: 20px;">Terima kasih atas pesanan Anda!</p>
      </div>
    `;

    try {
      const canvas = await window.html2canvas(tempDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`nota_${payment.nota}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage("Gagal membuat PDF: " + error.message);
    } finally {
      if (tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    // Menggunakan padding responsif: p-4 di mobile, meningkat menjadi p-8 di breakpoint sm ke atas
    <div className="p-4 sm:p-8">
      {/* Judul dengan ukuran teks responsif */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Manajemen Pembayaran</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setErrorMessage('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      {/* Kontainer tabel dengan overflow-x-auto untuk scroll horizontal di mobile */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Daftar Transaksi Pembayaran</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center">Tidak ada transaksi pembayaran yang tersedia.</p>
        ) : (
          <div className="overflow-x-auto"> {/* Ini adalah kunci untuk tabel responsif */}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  {/* Pastikan tidak ada spasi/baris baru di antara <th> */}
                  <th className="py-3 px-4 border-b border-gray-200">No.</th><th className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">Nama Pembeli</th><th className="py-3 px-4 border-b border-gray-200">Nota</th><th className="py-3 px-4 border-b border-gray-200">Metode</th><th className="py-3 px-4 border-b border-gray-200">Status</th><th className="py-3 px-4 border-b border-gray-200 min-w-[200px] md:min-w-[240px] lg:min-w-[280px]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    {/* Pastikan tidak ada spasi/baris baru di antara <td> */}
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{index + 1}</td><td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800 whitespace-nowrap">{payment.nama_pembeli}</td><td className="py-3 px-4 border-b border-gray-200 text-sm">
                      <button
                        onClick={() => handleDownloadNotaPdf(payment)}
                        // Ukuran teks responsif: text-xs di mobile, sm:text-sm di atasnya
                        className="text-blue-600 hover:underline inline-flex items-center text-xs sm:text-sm"
                        title={`Unduh Nota ${payment.nota}`}
                      >
                        <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5m-8 6h-4l-2 4h8l-2-4z"></path></svg>
                        <span className="truncate">Buka di sini</span> {/* truncate text for small screens */}
                      </button>
                    </td><td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800 whitespace-nowrap">{payment.metode_pembayaran}</td><td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800 whitespace-nowrap"> {/* Prevent wrapping */}
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold leading-tight ${
                          payment.is_paid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.is_paid ? 'Selesai' : 'Belum Dibayar'}
                      </span>
                    </td><td className="py-3 px-4 border-b border-gray-200 text-sm">
                      {/* Menggunakan flexbox untuk membungkus tombol aksi agar rapi di mobile */}
                      {/* Flex-col di mobile, flex-row di md ke atas */}
                      <div className="flex flex-col sm:flex-row gap-1"> 
                        {/* Tombol untuk "Selesai" */}
                        <button
                          onClick={() => handleMarkAsPaid(payment.id)}
                          disabled={payment.is_paid}
                          // Ukuran teks dan padding lebih kecil di mobile
                          className={`font-bold py-1 px-2 rounded-md inline-flex items-center justify-center transition duration-200 text-xs ${
                            payment.is_paid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                          title="Tandai sebagai Selesai"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" /> <span className="whitespace-nowrap">Selesai</span>
                        </button>
                        {/* Tombol untuk "Belum Dibayar" */}
                        <button
                          onClick={() => handleMarkAsUnpaid(payment.id)}
                          disabled={!payment.is_paid}
                          // Ukuran teks dan padding lebih kecil di mobile
                          className={`font-bold py-1 px-2 rounded-md inline-flex items-center justify-center transition duration-200 text-xs ${
                            !payment.is_paid ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          }`}
                          title="Tandai sebagai Belum Dibayar"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" /> <span className="whitespace-nowrap">Belum Dibayar</span>
                        </button>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(payment.id)}
                          // Ukuran teks dan padding lebih kecil di mobile
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md inline-flex items-center justify-center transition duration-200 text-xs"
                        >
                          <TrashIcon className="h-4 w-4 mr-1 flex-shrink-0" /> <span className="whitespace-nowrap">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div id="hiddenNotaPdfContainer" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '210mm', padding: '20mm', backgroundColor: 'white' }}>
      </div>
    </div>
  );
};

export default PaymentPage;