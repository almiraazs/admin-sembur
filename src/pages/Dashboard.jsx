// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// StatCard component - Sudah responsif dengan flexbox dan padding
const StatCard = ({ title, value, maxValue, valueLabel, description, buttonText }) => {
  const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center justify-between text-center">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6">{title}</h2> {/* Ukuran judul card responsif */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-4 sm:mb-6"> {/* Ukuran lingkaran responsif */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="6" // Lebar stroke lebih kecil di mobile
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-indigo-500"
            strokeWidth="6" // Lebar stroke lebih kecil di mobile
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-gray-800">
          <span className="text-2xl sm:text-3xl font-bold">{value}</span> {/* Ukuran angka responsif */}
          <span className="text-xs sm:text-sm text-gray-500">{valueLabel}</span> {/* Ukuran label responsif */}
        </div>
      </div>
      <div className="flex justify-around w-full mb-4 sm:mb-6 text-xs sm:text-sm"> {/* Ukuran teks bawah responsif */}
        <div className="flex items-center space-x-1 sm:space-x-2"> {/* Jarak antar item lebih rapat */}
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></span>
          <span>Total</span>
          <span className="font-medium text-gray-800">{maxValue}</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-500 rounded-full"></span>
          <span>Persentase</span>
          <span className="font-medium text-gray-800">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [salesChartPeriod, setSalesChartPeriod] = useState('monthly');
  const [revenueChartPeriod, setRevenueChartPeriod] = useState('monthly');

  // --- Data Penjualan (Stok Terjual) Contoh ---
  const monthlySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Stok Terjual',
        data: [65, 59, 80, 81, 56, 55, 40, 70, 60, 90, 85, 95],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const yearlySalesData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Stok Terjual',
        data: [1500, 1800, 2200, 2500, 2800, 3200],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // --- Data PENDAPATAN Contoh ---
  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Pendapatan',
        data: [15000000, 18000000, 22000000, 19000000, 25000000, 23000000, 20000000, 27000000, 24000000, 30000000, 28000000, 32000000],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const yearlyRevenueData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Pendapatan',
        data: [180000000, 220000000, 250000000, 280000000, 320000000, 350000000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // --- Opsi Grafik Penjualan (Stok Terjual) ---
  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 10 } } // Ukuran font legenda tetap 10px
      },
      title: {
        display: true,
        text: `Jumlah Stok Produk Terjual per ${salesChartPeriod === 'monthly' ? 'Bulan' : 'Tahun'}`,
        font: { size: 14 } // Ukuran font judul grafik tetap 14px
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            label += context.raw + ' Barang';
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) { return value; },
          font: { size: 10 } // Ukuran font Y-axis tetap 10px
        }
      },
      x: {
        ticks: { font: { size: 10 } } // Ukuran font X-axis tetap 10px
      }
    }
  };

  // --- Opsi Grafik PENDAPATAN (Nominal Rupiah) ---
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 10 } }
      },
      title: {
        display: true,
        text: `Total Pendapatan per ${revenueChartPeriod === 'monthly' ? 'Bulan' : 'Tahun'}`,
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.raw);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
          },
          font: { size: 10 }
        }
      },
      x: {
        ticks: { font: { size: 10 } }
      }
    }
  };

  const currentSalesChartData = salesChartPeriod === 'monthly' ? monthlySalesData : yearlySalesData;
  const currentRevenueChartData = revenueChartPeriod === 'monthly' ? monthlyRevenueData : yearlyRevenueData;

  return (
    <div className="p-4 sm:p-8"> {/* Padding yang responsif */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1> {/* Ukuran judul responsif */}

      {/* Grid Kartu Statistik - Sangat responsif */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8"> {/* Jarak antar kartu responsif */}
        <StatCard
          title="Stok Tersedia"
          value={8}
          maxValue={50}
          valueLabel="Item"
          description="Jumlah total produk yang siap dijual."
        />
        <StatCard
          title="Total Pesanan Baru"
          value={7}
          maxValue={10}
          valueLabel="Pesanan"
          description="Jumlah pesanan yang diterima hari ini."
        />
      </div>

      {/* Bagian Grafik Batang Total Penjualan (Stok Terjual) */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8"> {/* Padding responsif pada div grafik */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4"> {/* Layout tombol dan judul responsif */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Jumlah Stok Produk Terjual</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSalesChartPeriod('monthly')}
              className={`py-1 px-3 sm:py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                salesChartPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Per Bulan
            </button>
            <button
              onClick={() => setSalesChartPeriod('yearly')}
              className={`py-1 px-3 sm:py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                salesChartPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Per Tahun
            </button>
          </div>
        </div>
        <div className="h-64 sm:h-80"> {/* Tinggi grafik responsif */}
            <Bar data={currentSalesChartData} options={salesChartOptions} />
        </div>
      </div>

      {/* Bagian Grafik Batang Total PENDAPATAN */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md"> {/* Padding responsif pada div grafik */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4"> {/* Layout tombol dan judul responsif */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Total Pendapatan</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setRevenueChartPeriod('monthly')}
              className={`py-1 px-3 sm:py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                revenueChartPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Per Bulan
            </button>
            <button
              onClick={() => setRevenueChartPeriod('yearly')}
              className={`py-1 px-3 sm:py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                revenueChartPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Per Tahun
            </button>
          </div>
        </div>
        <div className="h-64 sm:h-80"> {/* Tinggi grafik responsif */}
            <Bar data={currentRevenueChartData} options={revenueChartOptions} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;