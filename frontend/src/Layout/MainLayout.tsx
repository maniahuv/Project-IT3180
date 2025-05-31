import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // thêm useNavigate để chuyển hướng
import ApplicationLogo from "../Component/ApplicationLogo";
import {
  FaHome,
  FaCog,
  FaCaretDown,
  FaQuestionCircle,
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token lưu trong localStorage (hoặc cookie tuỳ cách bạn lưu)
    localStorage.removeItem("token");

    // Chuyển hướng về trang đăng nhập
    navigate("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-full bg-slate-800 shadow-lg flex flex-col z-10">
        {/* Logo Section */}
        <div className="flex items-center p-6 border-b border-slate-700">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
            <ApplicationLogo />
          </div>
          <span className="font-bold text-xl text-white">Bluemoon</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-3 space-y-2">
            <li>
              <Link
                to="/homepage"
                className="flex items-center px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-colors"
              >
                <span className="mr-4">
                  <FaHome size="1.125rem" />
                </span>
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <button
                className="flex items-center w-full px-4 py-3 rounded-lg text-white hover:bg-slate-700 transition-colors justify-between"
                onClick={() => setSubmenuOpen(!submenuOpen)}
                type="button"
              >
                <span className="flex items-center">
                  <FaCog size="1.125rem" />
                  <span className="ml-5">Dịch Vụ</span>
                </span>
                <div
                  className={`transition-transform duration-200 ${
                    submenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <FaCaretDown size="0.875rem" />
                </div>
              </button>
              {submenuOpen && (
                <ul className="ml-8 mt-2 space-y-1">
                  <li>
                    <Link
                      to="/management/qlnhankhau"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Quản lý nhân khẩu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/qlhokhau"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Quản lí hộ khẩu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/qldotthu"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Quản lí đợt thu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/qlkhoanthu"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Quản lí khoản thu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/qltaikhoan"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Quản lí tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/qltamtrutamvang"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Quản lí tạm trú tạm vắng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/xemphieuthu"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Xem phiếu thu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/xuatbaocao"
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Xuất báo cáo
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area with margin-left to offset sidebar */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow-sm border-b px-6 py-4">
          <div></div>
          <div className="flex items-center space-x-6">
            <Link
              to="/tro-giup"
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
            >
              <span className="mr-2">
                <FaQuestionCircle />
              </span>
              Trợ giúp
            </Link>

            <div className="">
              <button
                onClick={() => setUserPopoverOpen(!userPopoverOpen)}
                className="flex items-center space-x-3 focus:outline-none hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                type="button"
              >
                <img
                  src="/images/ava.png"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                />
                <span className="text-gray-700 font-medium flex items-center">
                  Kieu Oanh
                  <span className="ml-2 text-xs">
                    <FaCaretDown />
                  </span>
                </span>
              </button>

              {userPopoverOpen && (
                <div
                  className="absolute right-0 mt-3 w-80 mr-3 bg-gray-300 rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header with email and close button */}
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                    <div className="text-sm text-gray-700 truncate max-w-xs">
                      nguyenkieuoanh…@gmail.com
                    </div>
                    <button
                      onClick={() => setUserPopoverOpen(false)}
                      className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                      type="button"
                    >
                      &times;
                    </button>
                  </div>

                  {/* User info section */}
                  <div className="p-6 flex items-center space-x-4 border-b">
                    <img
                      src="/images/ava.png"
                      alt="User"
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        Nguyễn Kiều Oanh
                      </div>
                      <Link
                        to="/quan-ly-tai-khoan"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Quản lý Tài khoản của bạn
                      </Link>
                    </div>
                  </div>

                  {/* Menu options */}
                  <div className="py-2">
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-500 mr-4">
                        <FaUser />
                      </span>
                      <span className="text-gray-700">Xem hồ sơ</span>
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-500 mr-4">
                        <FaUserPlus />
                      </span>
                      <span className="text-gray-700">Thêm tài khoản khác</span>
                    </Link>
                    {/* Đổi Link thành button để gọi hàm logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-t w-full text-left"
                      type="button"
                    >
                      <span className="text-gray-500 mr-4">
                        <FaSignOutAlt />
                      </span>
                      <span className="text-gray-700">Đăng xuất khỏi tất cả các tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
