import React, { useState, useRef, useEffect } from "react";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center bg-white border-b border-gray-300 px-6 py-3">
      <button
        className="text-gray-700 text-xl focus:outline-none"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="fa fa-bars"></i>
      </button>

      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
          <i className="fa fa-question-circle"></i> Trợ giúp
        </a>

        <div className="relative" ref={popoverRef}>
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setPopoverOpen(!popoverOpen)}
            aria-haspopup="true"
            aria-expanded={popoverOpen}
          >
            <img
              src="ava.png"
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700 select-none">
              Kieu Oanh <i className="fa fa-caret-down"></i>
            </span>
          </button>

          {popoverOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-20">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <span>nguyenkieuoanh…@gmail.com</span>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none text-lg"
                  onClick={() => setPopoverOpen(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              <div className="flex items-center px-4 py-3 border-b border-gray-200 gap-4">
                <img
                  src="ava.png"
                  alt="User avatar large"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-800">Nguyễn Kiều Oanh</div>
                  <a
                    href="#"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Quản lý Tài khoản của bạn
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
