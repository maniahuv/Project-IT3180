import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#dc3545]">Bluemoon</div>
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <Link to="/auth/login">Đăng nhập</Link>
          <a href="#">Sản phẩm</a>
          <a href="#">Giải pháp</a>
          <a href="#">Tài nguyên</a>
          <a href="#">Công ty</a>
          <a href="#">Liên hệ</a>
        </nav>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#0057ff] to-[#007bff] text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Giải pháp sống thông minh<br />cho quản lý chung cư
        </h1>
        <div className="space-x-4">
          <Link
            to="/auth/login"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded font-semibold"
          >
            Đăng nhập
          </Link>
          <Link
            to="/auth/register"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded font-semibold"
          >
            Đăng ký
          </Link>
        </div>
      </section>
      <section className="py-12 bg-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-[#444] mb-8">Dịch vụ của Bluemoon</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {/* Replace these with actual image URLs or components */}
          <div className="bg-white p-4 rounded shadow border border-pink-200">
            <img src="/images/1.png" alt="Service 1" className="w-full h-32 object-contain mb-2" />
          </div>
          <div className="bg-white p-4 rounded shadow border border-pink-200">
            <img src="/images/2.png" alt="Service 2" className="w-full h-32 object-contain mb-2" />
          </div>
          <div className="bg-white p-4 rounded shadow border border-pink-200">
            <img src="/images/3.png" alt="Service 3" className="w-full h-32 object-contain mb-2" />
          </div>
          <div className="bg-white p-4 rounded shadow border border-pink-200">
            <img src="/images/4.png" alt="Service 4" className="w-full h-32 object-contain mb-2" />
          </div>
        </div>
      </section>
      {/* Các section khác */}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        {/* Thêm route cho register nếu có */}
        <Route path="/auth/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
