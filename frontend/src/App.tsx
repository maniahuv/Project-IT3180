import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import QLTaiKhoan from './Pages/Management/QLTaiKhoan';
import QLDotThu from './Pages/Management/QLDotThu';
import QLHoKhau from './Pages/Management/QLHoKhau';
// import QLKhoanThu from './Pages/Management/QLKhoanThu';
import Account from './Pages/Account';
import HomePage from './Pages/HomePage';
import QLNhanKhau from './Pages/Management/QLNhanKhau';
import QLTamTruTamVang from './Pages/Management/QLTamTruTamVang';
import QLNopPhi from './Pages/Management/QLNopPhi';
import QLLichSuHoKhau from './Pages/Management/QLLichSuHoKhau';
import QLxuatbaocao from './Pages/Management/Xuatbaocao';
import XuatBaoCao from './Pages/Management/Xuatbaocao';
import ExportReport from './Pages/Management/ExportReport';
// Service data for the "Dịch vụ của Bluemoon" section
const services = [
  {
    imgSrc: '/images/1.png',
    alt: 'Quản lý cư dân',
    title: 'Quản lý cư dân',
    description: 'Theo dõi thông tin cư dân, hộ khẩu và tình trạng tạm trú/tạm vắng.'
  },
  {
    imgSrc: '/images/2.png',
    alt: 'Quản lý tài chính',
    title: 'Quản lý tài chính',
    description: 'Thu phí, quản lý khoản thu và nộp phí một cách minh bạch.'
  },
  {
    imgSrc: '/images/3.png',
    alt: 'Bảo mật tài khoản',
    title: 'Bảo mật tài khoản',
    description: 'Quản lý tài khoản người dùng với vai trò và quyền truy cập an toàn.'
  },
  {
    imgSrc: '/images/4.png',
    alt: 'Báo cáo thông minh',
    title: 'Báo cáo thông minh',
    description: 'Xuất báo cáo chi tiết để hỗ trợ ra quyết định hiệu quả.'
  }
];

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#dc3545]">Bluemoon</div>
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <Link to="/login">Đăng nhập</Link>
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
            to="/login"
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

      {/* Services section */}
      <section className="py-12 bg-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-[#444] mb-8">Dịch vụ của Bluemoon</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow border border-pink-200 flex flex-col items-center"
            >
              <img
                src={service.imgSrc}
                alt={service.alt}
                className="w-full h-32 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
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
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/management/qltaikhoan" element={<QLTaiKhoan />} />
        <Route path="/management/qldotthu" element={<QLDotThu />} />
        <Route path="/management/qlhokhau" element={<QLHoKhau />} />
        {/* <Route path="/management/qlkhoanthu" element={<QLKhoanThu />} /> */}
        <Route path="/management/qlnhankhau" element={<QLNhanKhau />} />
        <Route path="/management/qltamtrutamvang" element={<QLTamTruTamVang />} />
        <Route path="/account" element={<Account />} />
        <Route path="/management/qlnopphi" element={<QLNopPhi />} />
        <Route path="/management/qllichsuhoKhau" element={<QLLichSuHoKhau />} />
        <Route path="/management/xuatbaocao" element={<ExportReport />} />
      </Routes>
    </Router>
  );
}
