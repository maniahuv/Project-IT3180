import React, { useState, useEffect, useRef } from 'react';
import './manHinhQuanLiTaiKhoan.css';
import {
  FaHome,
  FaCog,
  FaCaretDown,
  FaQuestionCircle,
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes
} from 'react-icons/fa';

function formatDateISO(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return '';
}

function formatDateDisplay(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
}

const initialData = [
  {
    id: 1,
    maHoKhau: 'HK001',
    hoTen: 'Nguyễn Văn A',
    tenDangNhap: 'nguyenvana',
    email: 'nguyenvana@example.com',
    soDienThoai: '0987654321',
    ngayBatDau: '01/05/2022',
    phanQuyen: 'Admin',
    trangThai: 'Hoạt động'
  }
];

export default function QuanLiNhanKhau() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const [data, setData] = useState(initialData);
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [addingNew, setAddingNew] = useState(false);
  const [newRowData, setNewRowData] = useState({});

  const [searchCriteria, setSearchCriteria] = useState('0');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const userMenuRef = useRef();

  // Toggle submenu
  const toggleSubmenu = () => {
    setSubmenuOpen(prev => !prev);
  };

  // Toggle user popover
  const toggleUserPopover = e => {
    e.stopPropagation();
    setUserPopoverOpen(prev => !prev);
  };

  // Close popover on outside click
  useEffect(() => {
    const handler = () => setUserPopoverOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Handle edit click
  const handleEditClick = (row) => {
    if (editRowId === row.id) {
      // Save changes
      setData(data.map(item => (item.id === row.id ? { ...item, ...editFormData } : item)));
      setEditRowId(null);
      setEditFormData({});
    } else {
      // Start editing
      setEditRowId(row.id);
      setEditFormData({
        maHoKhau: row.maHoKhau,
        hoTen: row.hoTen,
        tenDangNhap: row.tenDangNhap,
        email: row.email,
        soDienThoai: row.soDienThoai,
        ngayBatDau: formatDateISO(row.ngayBatDau),
        phanQuyen: row.phanQuyen,
        trangThai: row.trangThai,
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân khẩu này?')) {
      setData(data.filter(item => item.id !== id));
      if (editRowId === id) {
        setEditRowId(null);
        setEditFormData({});
      }
    }
  };

  // Handle edit input change
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add new click
  const handleAddNewClick = () => {
    setAddingNew(true);
    setNewRowData({
      maHoKhau: '',
      hoTen: '',
      tenDangNhap: '',
      email: '',
      soDienThoai: '',
      ngayBatDau: '',
      phanQuyen: '',
      trangThai: ''
    });
  };

  // Handle new row input change
  const handleNewChange = e => {
    const { name, value } = e.target;
    setNewRowData(prev => ({ ...prev, [name]: value }));
  };

  // Save new row
  const handleSaveNewRow = () => {
    if (!newRowData.hoTen.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    setData([...data, { id: newId, ...newRowData, ngayBatDau: newRowData.ngayBatDau ? formatDateDisplay(newRowData.ngayBatDau) : '' }]);
    setAddingNew(false);
    setNewRowData({});
  };

  // Cancel new row
  const handleCancelNewRow = () => {
    setAddingNew(false);
    setNewRowData({});
  };

  // Handle search
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const found = data.find(item => {
      const fields = [
        item.id.toString(),
        item.maHoKhau,
        item.hoTen,
        item.tenDangNhap,
        item.email,
        item.soDienThoai,
        item.ngayBatDau,
        item.phanQuyen,
        item.trangThai
      ];
      return fields[crit].toLowerCase().includes(searchKeyword.toLowerCase());
    });
    if (found) {
      setHighlightedRowId(found.id);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy nhân khẩu phù hợp.');
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/B.png" alt="Logo" className="logo" />
          <span className="logo-text">Bluemoon</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="trang1.html"><FaHome /> <span>Trang chủ</span></a>
            </li>
            <li className="has-submenu">
              <button className="submenu-toggle" onClick={toggleSubmenu} type="button">
                <FaCog />
                <span>Dịch Vụ</span>
                <FaCaretDown className={`arrow ${submenuOpen ? 'rotated' : ''}`} />
              </button>
              <ul className={`submenu ${submenuOpen ? 'open' : ''}`}>
                <li><a href="QuanLiNhanKhau.html">Quản lý nhân khẩu</a></li>
                <li><a href="QuanLiHoKhau.html">Quản lí hộ khẩu</a></li>
                <li><a href="QuanLiDotThu.html">Quản lí đợt thu</a></li>
                <li><a href="QuanLiKhoanThu.html">Quản lí khoản thu</a></li>
                <li><a href="manHinhQuanLiTaiKhoan.html">Quản lí tài khoản</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left"></div>
          <div className="topbar-right">
            <a href="#" className="help"><FaQuestionCircle /> Trợ giúp</a>
            <div className="user-menu" onClick={toggleUserPopover} ref={userMenuRef}>
              <img src="/ava.png" alt="User" className="avatar" />
              <span>Kieu Oanh <FaCaretDown /></span>
              {userPopoverOpen && (
                <div className="user-popover" onClick={e => e.stopPropagation()}>
                  <div className="popover-header">
                    <div className="popover-email">nguyenkieuoanh…@gmail.com</div>
                    <button className="popover-close" onClick={() => setUserPopoverOpen(false)} aria-label="Close">&times;</button>
                  </div>
                  <div className="popover-account">
                    <img src="/ava.png" alt="User Large" className="avatar-lg" />
                    <div className="account-info">
                      <div className="account-name">Nguyễn Kiều Oanh</div>
                      <div className="account-manage"><a href="#">Quản lý Tài khoản của bạn</a></div>
                    </div>
                  </div>
                  <ul className="popover-list">
                    <li><a href="#"><FaUser /> Xem hồ sơ</a></li>
                    <li><a href="manHinhDangNhapDangKi.html"><FaUserPlus /> Thêm tài khoản khác</a></li>
                    <li><a href="trang1.html"><FaSignOutAlt /> Đăng xuất khỏi tất cả các tài khoản</a></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="content">
          <h2>Quản lý nhân khẩu</h2>

          <div className="actions">
            <div className="search-group">
              <select
                id="search-criteria"
                className="search-criteria"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">ID</option>
                <option value="1">Mã hộ khẩu</option>
                <option value="2">Họ và tên</option>
                <option value="3">Tên đăng nhập</option>
                <option value="4">Email</option>
                <option value="5">Số điện thoại</option>
                <option value="6">Ngày bắt đầu</option>
                <option value="7">Phân quyền</option>
                <option value="8">Trạng thái</option>
              </select>
              <input
                type="text"
                id="search-input"
                placeholder="Nhập từ khóa tìm kiếm"
                className="search"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button id="search-btn" className="btn search-btn" onClick={handleSearch}>
                <FaSearch /> Tìm kiếm
              </button>
            </div>

            <button id="add-btn" className="btn create" onClick={handleAddNewClick}>
              <FaPlus /> Tạo mới
            </button>
          </div>

          <table className="data-table" border="1" cellSpacing="0" cellPadding="6">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã hộ khẩu</th>
                <th>Họ và tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày bắt đầu</th>
                <th>Phân quyền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr
                  key={row.id}
                  id={`row-${row.id}`}
                  className={highlightedRowId === row.id ? 'highlighted' : ''}
                >
                  <td>{row.id}</td>
                  {editRowId === row.id ? (
                    <>
                      <td><input type="text" name="maHoKhau" value={editFormData.maHoKhau} onChange={handleEditChange} /></td>
                      <td><input type="text" name="hoTen" value={editFormData.hoTen} onChange={handleEditChange} /></td>
                      <td><input type="text" name="tenDangNhap" value={editFormData.tenDangNhap} onChange={handleEditChange} /></td>
                      <td><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} /></td>
                      <td><input type="tel" name="soDienThoai" value={editFormData.soDienThoai} onChange={handleEditChange} /></td>
                      <td><input type="date" name="ngayBatDau" value={editFormData.ngayBatDau} onChange={handleEditChange} /></td>
                      <td><input type="text" name="phanQuyen" value={editFormData.phanQuyen} onChange={handleEditChange} /></td>
                      <td><input type="text" name="trangThai" value={editFormData.trangThai} onChange={handleEditChange} /></td>
                    </>
                  ) : (
                    <>
                      <td>{row.maHoKhau}</td>
                      <td>{row.hoTen}</td>
                      <td>{row.tenDangNhap}</td>
                      <td>{row.email}</td>
                      <td>{row.soDienThoai}</td>
                      <td>{row.ngayBatDau}</td>
                      <td>{row.phanQuyen}</td>
                      <td>{row.trangThai}</td>
                    </>
                  )}
                  <td className="actions-cell">
                    {addingNew ? null : editRowId === row.id ? (
                      <button className="btn save" onClick={() => handleEditClick(row)} title="Lưu"><FaSave /></button>
                    ) : (
                      <button className="btn edit" onClick={() => handleEditClick(row)} title="Chỉnh sửa"><FaPen /></button>
                    )}
                    {!addingNew && (
                      <button className="btn delete" onClick={() => handleDeleteClick(row.id)} title="Xóa"><FaTrashAlt /></button>
                    )}
                  </td>
                </tr>
              ))}

              {addingNew && (
                <tr>
                  <td>{data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1}</td>
                  <td><input type="text" name="maHoKhau" placeholder="Mã hộ khẩu" value={newRowData.maHoKhau || ''} onChange={handleNewChange} /></td>
                  <td><input type="text" name="hoTen" placeholder="Họ và tên" value={newRowData.hoTen || ''} onChange={handleNewChange} /></td>
                  <td><input type="text" name="tenDangNhap" placeholder="Tên đăng nhập" value={newRowData.tenDangNhap || ''} onChange={handleNewChange} /></td>
                  <td><input type="email" name="email" placeholder="Email" value={newRowData.email || ''} onChange={handleNewChange} /></td>
                  <td><input type="tel" name="soDienThoai" placeholder="Số điện thoại" value={newRowData.soDienThoai || ''} onChange={handleNewChange} /></td>
                  <td><input type="date" name="ngayBatDau" value={newRowData.ngayBatDau || ''} onChange={handleNewChange} /></td>
                  <td><input type="text" name="phanQuyen" placeholder="Phân quyền" value={newRowData.phanQuyen || ''} onChange={handleNewChange} /></td>
                  <td><input type="text" name="trangThai" placeholder="Trạng thái" value={newRowData.trangThai || ''} onChange={handleNewChange} /></td>
                  <td className="actions-cell">
                    <button className="btn save" onClick={handleSaveNewRow} title="Lưu"><FaSave /></button>
                    <button className="btn cancel" onClick={handleCancelNewRow} title="Hủy"><FaTimes /></button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <label>
              Hiển thị
              <select>
                <option>10</option><option>25</option><option>50</option>
              </select>
              mục
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
