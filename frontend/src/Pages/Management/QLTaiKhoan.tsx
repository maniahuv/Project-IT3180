import React, { useState} from 'react';
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import MainLayout from '../../Layout/MainLayout';

// Interface definitions
interface NhanKhau {
  id: number;
  maHoKhau: string;
  hoTen: string;
  tenDangNhap: string;
  email: string;
  soDienThoai: string;
  ngayBatDau: string;
  phanQuyen: string;
  trangThai: string;
}

interface EditFormData {
  maHoKhau: string;
  hoTen: string;
  tenDangNhap: string;
  email: string;
  soDienThoai: string;
  ngayBatDau: string;
  phanQuyen: string;
  trangThai: string;
}

// Utility functions
const formatDateISO = (dateStr: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return '';
};

const formatDateDisplay = (dateStr: string): string => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
};

// Initial data
const initialData: NhanKhau[] = [
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
  },
  {
    id: 2,
    maHoKhau: 'HK002',
    hoTen: 'Trần Thị B',
    tenDangNhap: 'tranthib',
    email: 'tranthib@example.com',
    soDienThoai: '0987654322',
    ngayBatDau: '15/06/2022',
    phanQuyen: 'User',
    trangThai: 'Hoạt động'
  },
  {
    id: 3,
    maHoKhau: 'HK003',
    hoTen: 'Lê Văn C',
    tenDangNhap: 'levanc',
    email: 'levanc@example.com',
    soDienThoai: '0987654323',
    ngayBatDau: '20/07/2022',
    phanQuyen: 'User',
    trangThai: 'Tạm khóa'
  }
];

const QuanLyNhanKhau: React.FC = () => {
  const [data, setData] = useState<NhanKhau[]>(initialData);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    maHoKhau: '',
    hoTen: '',
    tenDangNhap: '',
    email: '',
    soDienThoai: '',
    ngayBatDau: '',
    phanQuyen: '',
    trangThai: ''
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    maHoKhau: '',
    hoTen: '',
    tenDangNhap: '',
    email: '',
    soDienThoai: '',
    ngayBatDau: '',
    phanQuyen: '',
    trangThai: ''
  });

  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);


  // Handle edit click
  const handleEditClick = (row: NhanKhau): void => {
    if (editRowId === row.id) {
      // Save changes
      setData(data.map(item => (item.id === row.id ? { 
        ...item, 
        ...editFormData,
        ngayBatDau: editFormData.ngayBatDau ? formatDateDisplay(editFormData.ngayBatDau) : item.ngayBatDau
      } : item)));
      setEditRowId(null);
      setEditFormData({
        maHoKhau: '',
        hoTen: '',
        tenDangNhap: '',
        email: '',
        soDienThoai: '',
        ngayBatDau: '',
        phanQuyen: '',
        trangThai: ''
      });
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
  const handleDeleteClick = (id: number): void => {
    if (window.confirm('Bạn có chắc muốn xóa nhân khẩu này?')) {
      setData(data.filter(item => item.id !== id));
      if (editRowId === id) {
        setEditRowId(null);
        setEditFormData({
          maHoKhau: '',
          hoTen: '',
          tenDangNhap: '',
          email: '',
          soDienThoai: '',
          ngayBatDau: '',
          phanQuyen: '',
          trangThai: ''
        });
      }
    }
  };

  // Handle edit input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add new click
  const handleAddNewClick = (): void => {
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
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({ ...prev, [name]: value }));
  };

  // Save new row
  const handleSaveNewRow = (): void => {
    if (!newRowData.hoTen.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    const newItem: NhanKhau = { 
      id: newId, 
      ...newRowData, 
      ngayBatDau: newRowData.ngayBatDau ? formatDateDisplay(newRowData.ngayBatDau) : '' 
    };
    setData([...data, newItem]);
    setAddingNew(false);
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

  // Cancel new row
  const handleCancelNewRow = (): void => {
    setAddingNew(false);
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

  // Handle search
  const handleSearch = (): void => {
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
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    
    if (found) {
      setHighlightedRowId(found.id);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy nhân khẩu phù hợp.');
    }
  };

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MainLayout>
   

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
     

        {/* Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý nhân khẩu</h2>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="Nhập từ khóa tìm kiếm"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                onClick={handleSearch}
              >
                <FaSearch />
                <span>Tìm kiếm</span>
              </button>
            </div>

            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              onClick={handleAddNewClick}
            >
              <FaPlus />
              <span>Tạo mới</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Họ và tên</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên đăng nhập</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số điện thoại</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phân quyền</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(row => (
                  <tr
                    key={row.id}
                    id={`row-${row.id}`}
                    className={`hover:bg-gray-50 ${highlightedRowId === row.id ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    {editRowId === row.id ? (
                      <>
                        <td className="px-4 py-3"><input type="text" name="maHoKhau" value={editFormData.maHoKhau} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="text" name="hoTen" value={editFormData.hoTen} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="text" name="tenDangNhap" value={editFormData.tenDangNhap} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="tel" name="soDienThoai" value={editFormData.soDienThoai} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="date" name="ngayBatDau" value={editFormData.ngayBatDau} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="text" name="phanQuyen" value={editFormData.phanQuyen} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                        <td className="px-4 py-3"><input type="text" name="trangThai" value={editFormData.trangThai} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" /></td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.maHoKhau}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.hoTen}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.tenDangNhap}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.soDienThoai}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.ngayBatDau}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${row.phanQuyen === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {row.phanQuyen}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${row.trangThai === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {row.trangThai}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => handleEditClick(row)}
                          title={editRowId === row.id ? "Lưu" : "Chỉnh sửa"}
                        >
                          {editRowId === row.id ? <FaSave /> : <FaPen />}
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          onClick={() => handleDeleteClick(row.id)}
                          title="Xóa"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {addingNew && (
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1}</td>
                    <td className="px-4 py-3"><input type="text" name="maHoKhau" placeholder="Mã hộ khẩu" value={newRowData.maHoKhau} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="text" name="hoTen" placeholder="Họ và tên" value={newRowData.hoTen} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="text" name="tenDangNhap" placeholder="Tên đăng nhập" value={newRowData.tenDangNhap} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="email" name="email" placeholder="Email" value={newRowData.email} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="tel" name="soDienThoai" placeholder="Số điện thoại" value={newRowData.soDienThoai} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="date" name="ngayBatDau" value={newRowData.ngayBatDau} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="text" name="phanQuyen" placeholder="Phân quyền" value={newRowData.phanQuyen} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3"><input type="text" name="trangThai" placeholder="Trạng thái" value={newRowData.trangThai} onChange={handleNewChange} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={handleSaveNewRow}
                          title="Lưu"
                        >
                          <FaSave />
                        </button>
                        <button 
                          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          onClick={handleCancelNewRow}
                          title="Hủy"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Hiển thị</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
            </div>
            <div className="text-sm text-gray-700">
              Tổng cộng: {data.length} nhân khẩu
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QuanLyNhanKhau;