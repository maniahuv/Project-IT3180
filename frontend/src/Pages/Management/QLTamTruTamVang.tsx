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
  TamTruTamVang, 
  fetchAllTamTruTamVang, 
  createTamTruTamVang, 
  updateTamTruTamVang, 
  deleteTamTruTamVang 
} from '../../api/TamTruTamVangApi';

interface EditFormData {
  loai?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  lyDo?: string;
  nhanKhau: { maNhanKhau: number };
}

// Define loai options with colors
const loaiOptions = [
  { value: 'Tạm trú', label: 'Tạm trú', color: 'bg-blue-100 text-blue-800' },
  { value: 'Tạm vắng', label: 'Tạm vắng', color: 'bg-yellow-100 text-yellow-800' }
];

const getLoaiColor = (loai?: string): string => {
  const option = loaiOptions.find(opt => opt.value === loai);
  return option ? option.color : 'bg-gray-100 text-gray-800';
};

const QLTamTruTamVang: React.FC = () => {
  const [data, setData] = useState<TamTruTamVang[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    loai: 'Tạm trú',
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
    nhanKhau: { maNhanKhau: 0 }
  });

  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    loai: 'Tạm trú',
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
    nhanKhau: { maNhanKhau: 0 }
  });

  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data from API
  useEffect(() => {
    loadTamTruTamVang();
  }, []);

  const loadTamTruTamVang = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTamTruTamVang();
      console.log('TamTruTamVang response:', response.data);
      setData(response.data);
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading tam tru tam vang:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = async (row: TamTruTamVang): Promise<void> => {
    if (editRowId === row.id) {
      try {
        const updateData: TamTruTamVang = {
          id: row.id,
          loai: editFormData.loai,
          ngayBatDau: editFormData.ngayBatDau,
          ngayKetThuc: editFormData.ngayKetThuc,
          lyDo: editFormData.lyDo,
          nhanKhau: editFormData.nhanKhau
        };
        
        await updateTamTruTamVang(row.id!, updateData);
        await loadTamTruTamVang();
        setEditRowId(null);
        setEditFormData({
          loai: 'Tạm trú',
          ngayBatDau: '',
          ngayKetThuc: '',
          lyDo: '',
          nhanKhau: { maNhanKhau: 0 }
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating tam tru tam vang:', err);
      }
    } else {
      setEditRowId(row.id!);
      setEditFormData({
        loai: row.loai || 'Tạm trú',
        ngayBatDau: row.ngayBatDau || '',
        ngayKetThuc: row.ngayKetThuc || '',
        lyDo: row.lyDo || '',
        nhanKhau: row.nhanKhau
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      try {
        await deleteTamTruTamVang(id);
        await loadTamTruTamVang();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            loai: 'Tạm trú',
            ngayBatDau: '',
            ngayKetThuc: '',
            lyDo: '',
            nhanKhau: { maNhanKhau: 0 }
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting tam tru tam vang:', err);
      }
    }
  };

  // Handle edit input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'nhanKhau.maNhanKhau' ? { maNhanKhau: Number(value) } : value
    }));
  };

  // Handle add new click
  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      loai: 'Tạm trú',
      ngayBatDau: '',
      ngayKetThuc: '',
      lyDo: '',
      nhanKhau: { maNhanKhau: 0 }
    });
  };

  // Handle new row input change
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: name === 'nhanKhau.maNhanKhau' ? { maNhanKhau: Number(value) } : value
    }));
  };

  // Save new row
  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.loai?.trim()) {
      alert('Vui lòng chọn loại (Tạm trú/Tạm vắng).');
      return;
    }
    if (!newRowData.ngayBatDau?.trim()) {
      alert('Vui lòng nhập ngày bắt đầu.');
      return;
    }
    if (newRowData.nhanKhau.maNhanKhau <= 0) {
      alert('Vui lòng nhập mã nhân khẩu hợp lệ.');
      return;
    }

    try {
      const newTamTruTamVang: TamTruTamVang = {
        loai: newRowData.loai,
        ngayBatDau: newRowData.ngayBatDau,
        ngayKetThuc: newRowData.ngayKetThuc,
        lyDo: newRowData.lyDo,
        nhanKhau: newRowData.nhanKhau
      };
      
      await createTamTruTamVang(newTamTruTamVang);
      await loadTamTruTamVang();
      setAddingNew(false);
      setNewRowData({
        loai: 'Tạm trú',
        ngayBatDau: '',
        ngayKetThuc: '',
        lyDo: '',
        nhanKhau: { maNhanKhau: 0 }
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo bản ghi: ' + (err.response?.data?.message || err.message));
      console.error('Error creating tam tru tam vang:', err);
    }
  };

  // Cancel new row
  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      loai: 'Tạm trú',
      ngayBatDau: '',
      ngayKetThuc: '',
      lyDo: '',
      nhanKhau: { maNhanKhau: 0 }
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
        item.loai || '',
        item.ngayBatDau || '',
        item.ngayKetThuc || '',
        item.lyDo || '',
        item.nhanKhau.maNhanKhau.toString()
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    
    if (found) {
      setHighlightedRowId(found.id!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy bản ghi phù hợp.');
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
              onClick={loadTamTruTamVang}
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
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý tạm trú tạm vắng</h2>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">ID</option>
                <option value="1">Loại</option>
                <option value="2">Ngày bắt đầu</option>
                <option value="3">Ngày kết thúc</option>
                <option value="4">Lý do</option>
                <option value="5">Mã nhân khẩu</option>
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
              <span>Thêm bản ghi</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày kết thúc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lý do</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã nhân khẩu</th>
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
                          <select 
                            name="loai" 
                            value={editFormData.loai || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          >
                            {loaiOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="date" 
                            name="ngayBatDau" 
                            value={editFormData.ngayBatDau || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="date" 
                            name="ngayKetThuc" 
                            value={editFormData.ngayKetThuc || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea 
                            name="lyDo" 
                            value={editFormData.lyDo || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            name="nhanKhau.maNhanKhau" 
                            value={editFormData.nhanKhau.maNhanKhau || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded ${getLoaiColor(row.loai)}`}>
                            {row.loai || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.ngayBatDau || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.ngayKetThuc || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.lyDo || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.nhanKhau.maNhanKhau}</td>
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
                      <select 
                        name="loai" 
                        value={newRowData.loai || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded"
                      >
                        {loaiOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="date" 
                        name="ngayBatDau" 
                        value={newRowData.ngayBatDau || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="date" 
                        name="ngayKetThuc" 
                        value={newRowData.ngayKetThuc || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea 
                        name="lyDo" 
                        value={newRowData.lyDo || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        name="nhanKhau.maNhanKhau" 
                        value={newRowData.nhanKhau.maNhanKhau || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
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
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
            </div>
            <div className="text-sm text-gray-700">
              Tổng cộng: {data.length} bản ghi
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLTamTruTamVang;