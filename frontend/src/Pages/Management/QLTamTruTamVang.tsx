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
  loai: string;
  ngayBatDau: string;
  ngayKetThuc?: string;
  lyDo?: string;
  maNhanKhau: number;
}

const loaiOptions = [
  { value: 'Tạm trú', label: 'Tạm trú' },
  { value: 'Tạm vắng', label: 'Tạm vắng' }
];

const getLoaiLabel = (loai?: string): string => {
  const option = loaiOptions.find(opt => opt.value === loai);
  return option ? option.label : 'Không xác định';
};

// Utility function to format date for display
const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
};

const QLTamTruTamVang: React.FC = () => {
  const [data, setData] = useState<TamTruTamVang[]>([]);
  const [filteredData, setFilteredData] = useState<TamTruTamVang[]>([]); // New state for filtered data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    loai: 'Tạm trú',
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
    maNhanKhau: 0
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    loai: 'Tạm trú',
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
    maNhanKhau: 0
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data from API
  useEffect(() => {
    loadData();
  }, []);

  // Update filteredData when data changes
  useEffect(() => {
    setFilteredData(data); // Reset filteredData to original data when data changes
  }, [data]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTamTruTamVang();
      console.log('TamTruTamVang data loaded:', response.data);
      setData(response.data);
      setFilteredData(response.data); // Initialize filteredData
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading data:', err);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (row: TamTruTamVang): Promise<void> => {
    if (editRowId === row.id) {
      try {
        const updateData: TamTruTamVang = {
          id: row.id,
          loai: editFormData.loai,
          ngayBatDau: editFormData.ngayBatDau,
          ngayKetThuc: editFormData.ngayKetThuc || undefined,
          lyDo: editFormData.lyDo || undefined,
          nhanKhau: { maNhanKhau: editFormData.maNhanKhau }
        };
        await updateTamTruTamVang(row.id!, updateData);
        await loadData();
        setEditRowId(null);
        setEditFormData({
          loai: 'Tạm trú',
          ngayBatDau: '',
          ngayKetThuc: '',
          lyDo: '',
          maNhanKhau: 0
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
        maNhanKhau: row.nhanKhau?.maNhanKhau || 0
      });
    }
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      try {
        await deleteTamTruTamVang(id);
        await loadData();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            loai: 'Tạm trú',
            ngayBatDau: '',
            ngayKetThuc: '',
            lyDo: '',
            maNhanKhau: 0
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting tam tru tam vang:', err);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'maNhanKhau' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      loai: 'Tạm trú',
      ngayBatDau: '',
      ngayKetThuc: '',
      lyDo: '',
      maNhanKhau: 0
    });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: name === 'maNhanKhau' ? parseInt(value) || 0 : value
    }));
  };

  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.loai) {
      alert('Vui lòng chọn loại.');
      return;
    }
    if (!newRowData.ngayBatDau) {
      alert('Vui lòng nhập ngày bắt đầu.');
      return;
    }
    if (newRowData.maNhanKhau <= 0) {
      alert('Vui lòng nhập mã nhân khẩu hợp lệ.');
      return;
    }

    try {
      const newTamTruTamVang: TamTruTamVang = {
        loai: newRowData.loai,
        ngayBatDau: newRowData.ngayBatDau,
        ngayKetThuc: newRowData.ngayKetThuc || undefined,
        lyDo: newRowData.lyDo || undefined,
        nhanKhau: { maNhanKhau: newRowData.maNhanKhau }
      };
      await createTamTruTamVang(newTamTruTamVang);
      await loadData();
      setAddingNew(false);
      setNewRowData({
        loai: 'Tạm trú',
        ngayBatDau: '',
        ngayKetThuc: '',
        lyDo: '',
        maNhanKhau: 0
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo bản ghi: ' + (err.response?.data?.message || err.message));
      console.error('Error creating tam tru tam vang:', err);
    }
  };

  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      loai: 'Tạm trú',
      ngayBatDau: '',
      ngayKetThuc: '',
      lyDo: '',
      maNhanKhau: 0
    });
  };

  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredData(data); // Reset to full data if search keyword is empty
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = data.filter(item => {
      const fields = [
        item.id?.toString() || '',
        getLoaiLabel(item.loai),
        formatDateDisplay(item.ngayBatDau),
        formatDateDisplay(item.ngayKetThuc),
        item.lyDo || '',
        item.nhanKhau?.maNhanKhau?.toString() || ''
      ];
      return fields[crit]?.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredData(filtered);
      setHighlightedRowId(filtered[0].id!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredData([]);
      alert('Không tìm thấy bản ghi phù hợp.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredData(data); // Reset to full data when search input is cleared
    }
  };

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
              onClick={loadData}
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

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã bản ghi</option>
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
                onChange={handleSearchChange} // Updated to handle input change
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã bản ghi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày kết thúc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lý do</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã nhân khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map(row => ( // Use filteredData instead of data
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
                            value={editFormData.loai}
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
                            value={editFormData.ngayBatDau}
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
                            name="maNhanKhau"
                            value={editFormData.maNhanKhau || row.maNhanKhau}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              row.loai === 'Tạm trú' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {getLoaiLabel(row.loai)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayBatDau)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayKetThuc)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.lyDo || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.maNhanKhau || '-'}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => handleEditClick(row)}
                          title={editRowId === row.id ? 'Lưu' : 'Chỉnh sửa'}
                        >
                          {editRowId === row.id ? <FaSave /> : <FaPen />}
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
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
                    <td className="px-4 py-3 text-sm text-gray-800">-</td>
                    <td className="px-4 py-3">
                      <select
                        name="loai"
                        value={newRowData.loai}
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
                        value={newRowData.ngayBatDau}
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
                        placeholder="Lý do"
                        value={newRowData.lyDo || ''}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="maNhanKhau"
                        placeholder="Mã nhân khẩu"
                        value={newRowData.maNhanKhau || ''}
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
              Tổng cộng: {filteredData.length} bản ghi {/* Updated to use filteredData.length */}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLTamTruTamVang;