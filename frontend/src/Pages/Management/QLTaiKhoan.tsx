import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import MainLayout from '../../Layout/MainLayout';
import { 
  TaiKhoan, 
  fetchAllTaiKhoan, 
  createTaiKhoan, 
  updateTaiKhoan, 
  deleteTaiKhoan 
} from '../../api/TaiKhoanApi';

interface EditFormData {
  username: string;
  password?: string;
  hoTen: string;
  vaiTro?: number;
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

// Vai trò mapping
const vaiTroOptions = [
  { value: 1, label: 'TO_TRUONG' },
  { value: 2, label: 'TO_PHO' },
  { value: 3, label: 'KE_TOAN' }
];

const getVaiTroLabel = (vaiTro?: number): string => {
  const option = vaiTroOptions.find(opt => opt.value === vaiTro);
  return option ? option.label : 'Không xác định';
};

const QLTaiKhoan: React.FC = () => {
  const [data, setData] = useState<TaiKhoan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    username: '',
    password: '',
    hoTen: '',
    vaiTro: 1
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    username: '',
    password: '',
    hoTen: '',
    vaiTro: 1
  });

  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data from API
  useEffect(() => {
    loadTaiKhoan();
  }, []);

  const loadTaiKhoan = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTaiKhoan();
      console.log('Tai khoan data loaded:', response.data);
      setData(response.data);
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading tai khoan:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = async (row: TaiKhoan): Promise<void> => {
    if (editRowId === row.id) {
      // Save changes
      try {
        const updateData: TaiKhoan = {
          ...editFormData,
          id: row.id
        };
        
        await updateTaiKhoan(row.id!, updateData);
        await loadTaiKhoan(); // Reload data after update
        setEditRowId(null);
        setEditFormData({
          username: '',
          password: '',
          hoTen: '',
          vaiTro: 1
        });
        // alert('Cập nhật tài khoản thành công!');
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating tai khoan:', err);
      }
    } else {
      // Start editing
      setEditRowId(row.id!);
      setEditFormData({
        username: row.username,
        password: '', // Don't show existing password
        hoTen: row.hoTen,
        vaiTro: row.vaiTro
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      try {
        await deleteTaiKhoan(id);
        await loadTaiKhoan(); // Reload data after delete
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            username: '',
            password: '',
            hoTen: '',
            vaiTro: 1
          });
        }
        // alert('Xóa tài khoản thành công!');
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting tai khoan:', err);
      }
    }
  };

  // Handle edit input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: name === 'vaiTro' ? parseInt(value) : value 
    }));
  };

  // Handle add new click
  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      username: '',
      password: '',
      hoTen: '',
      vaiTro: 1
    });
  };

  // Handle new row input change
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({ 
      ...prev, 
      [name]: name === 'vaiTro' ? parseInt(value) : value 
    }));
  };

  // Save new row
  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.hoTen.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    if (!newRowData.username.trim()) {
      alert('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (!newRowData.password?.trim()) {
      alert('Vui lòng nhập mật khẩu.');
      return;
    }

    try {
      const newTaiKhoan: TaiKhoan = {
        username: newRowData.username,
        password: newRowData.password,
        hoTen: newRowData.hoTen,
        vaiTro: newRowData.vaiTro
      };
      
      await createTaiKhoan(newTaiKhoan);
      await loadTaiKhoan(); // Reload data after create
      setAddingNew(false);
      setNewRowData({
        username: '',
        password: '',
        hoTen: '',
        vaiTro: 1
      });
      // alert('Tạo tài khoản thành công!');
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo tài khoản: ' + (err.response?.data?.message || err.message));
      console.error('Error creating tai khoan:', err);
    }
  };

  // Cancel new row
  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      username: '',
      password: '',
      hoTen: '',
      vaiTro: 1
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
        item.id?.toString() || '',
        item.username,
        item.hoTen,
        getVaiTroLabel(item.vaiTro)
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    
    if (found) {
      setHighlightedRowId(found.id!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy tài khoản phù hợp.');
    }
  };

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải dữ liệu...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={loadTaiKhoan}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý tài khoản</h2>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">ID</option>
                <option value="1">Tên đăng nhập</option>
                <option value="2">Họ và tên</option>
                <option value="3">Vai trò</option>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên đăng nhập</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Họ và tên</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mật khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vai trò</th>
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
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="username" 
                            value={editFormData.username} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="hoTen" 
                            value={editFormData.hoTen} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="password" 
                            name="password" 
                            value={editFormData.password || ''} 
                            onChange={handleEditChange} 
                            placeholder="Nhập mật khẩu mới (để trống nếu không thay đổi)"
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            name="vaiTro" 
                            value={editFormData.vaiTro} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          >
                            {vaiTroOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.hoTen}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">••••••••</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            row.vaiTro === 1 ? 'bg-purple-100 text-purple-800' : 
                            row.vaiTro === 2 ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getVaiTroLabel(row.vaiTro)}
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
                          onClick={() => handleDeleteClick(row.id!)}
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
                    <td className="px-4 py-3 text-sm text-gray-900">-</td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="username" 
                        placeholder="Tên đăng nhập" 
                        value={newRowData.username} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="hoTen" 
                        placeholder="Họ và tên" 
                        value={newRowData.hoTen} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="password" 
                        name="password" 
                        placeholder="Mật khẩu" 
                        value={newRowData.password || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        name="vaiTro" 
                        value={newRowData.vaiTro} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded"
                      >
                        {vaiTroOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
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
              Tổng cộng: {data.length} tài khoản
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLTaiKhoan;