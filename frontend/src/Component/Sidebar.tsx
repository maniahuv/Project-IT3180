import React, { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);

  return (
    <aside
      className={`bg-blue-900 text-white flex flex-col transition-width duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center gap-2 p-4 border-b border-blue-800">
        <img src="B.png" alt="Logo" className="h-10" />
        {isOpen && <span className="text-xl font-bold select-none">Bluemoon</span>}
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="flex flex-col">
          <li>
            <a
              href="trang1.html"
              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-700 transition-colors"
              title="Trang chủ"
            >
              <i className="fa fa-home w-5 text-center"></i>
              {isOpen && <span>Trang chủ</span>}
            </a>
          </li>

          <li>
            <button
              className="flex items-center justify-between w-full gap-3 px-4 py-3 hover:bg-blue-700 transition-colors focus:outline-none"
              onClick={() => setSubmenuOpen(!submenuOpen)}
              aria-expanded={submenuOpen}
            >
              <div className="flex items-center gap-3">
                <i className="fa fa-cog w-5 text-center"></i>
                {isOpen && <span>Dịch Vụ</span>}
              </div>
              {isOpen && (
                <i
                  className={`fa fa-caret-down transition-transform duration-200 ${
                    submenuOpen ? "rotate-180" : ""
                  }`}
                ></i>
              )}
            </button>
            {submenuOpen && isOpen && (
              <ul className="bg-blue-800">
                <li>
                  <a
                    href="QuanLiNhanKhau.html"
                    className="block px-12 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Quản lý nhân khẩu
                  </a>
                </li>
                <li>
                  <a
                    href="QuanLiHoKhau.html"
                    className="block px-12 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Quản lí hộ khẩu
                  </a>
                </li>
                <li>
                  <a
                    href="QuanLiDotThu.html"
                    className="block px-12 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Quản lí đợt thu
                  </a>
                </li>
                <li>
                  <a
                    href="QuanLiKhoanThu.html"
                    className="block px-12 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Quản lí khoản thu
                  </a>
                </li>
                <li>
                  <a
                    href="manHinhQuanLiTaiKhoan.html"
                    className="block px-12 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Quản lí tài khoản
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}
