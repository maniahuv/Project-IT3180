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
  DotThu, 
  fetchAllDotThu, 
  createDotThu, 
  updateDotThu, 
  deleteDotThu 
} from '../../api/DotThuApi';
import { KhoanThu } from '../../api/KhoanThuApi';

interface EditFormData {
  tenDotThu: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: string;
}

const trangThaiOptions = [
  { value: 'DANG_DIEN_RA', label: 'Đang diễn ra', color: 'bg-green-100 text-green-800' },
  { value: 'DA_HOAN_THANH', label: 'Đã hoàn thành', color: 'bg-blue-100 text-blue-800' },
  { value: 'TAM_HOAN', label: 'Tạm hoãn', color: 'bg-yellow-100 text-yellow-800' }
];

const getTrangThaiLabel = (trangThai?: string): string => {
  const option = trangThaiOptions.find(opt => opt.value === trangThai);
  return option ? option.label : 'Không xác định';
};

const getTrangThaiColor = (trangThai?: string): string => {
  const option = trangThaiOptions.find(opt => opt.value === trangThai);
  return option ? option.color : 'bg-gray-100 text-gray-800';
};

const formatDateISO = (dateStr: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return '';
};

const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
};

const QLDotThu: React.FC = () => {
  const [data, setData] = useState<DotThu[]>([]);
  const [filteredData, setFilteredData] = useState<DotThu[]>([]); // New state for filtered data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    tenDotThu: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'DANG_DIEN_RA'
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    tenDotThu: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'DANG_DIEN_RA'
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data from API
  useEffect(() => {
    loadDotThu();
  }, []);

  // Update filteredData when data changes
  useEffect(() => {
    setFilteredData(data); // Reset filteredData to original data when data changes
  }, [data]);

  const loadDotThu = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      setLoading(true);
      const response = await fetchAllDotThu();
      console.log('Raw API response:', JSON.stringify(response, null, 2));
      console.log('Response data type:', typeof response.data, Array.isArray(response.data));
      let dataArray: DotThu[] = [];
      if (typeof response.data === 'string') {
        try {
          dataArray = JSON.parse(response.data);
        } catch (parseError) {
          console.error('Failed to parse response.data:', parseError);
        }
      } else if (Array.isArray(response.data)) {
        dataArray = response.data;
      }
      setData(dataArray);
      setFilteredData(dataArray); // Initialize filteredData
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading dot thu:', err);
      console.error('Error response:', err.response);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = async (row: DotThu): Promise<void> => {
    if (editRowId === row.maDotThu) {
      try {
        const updateData: DotThu = {
          maDotThu: row.maDotThu,
          tenDotThu: editFormData.tenDotThu,
          ngayBatDau: editFormData.ngayBatDau ? formatDateISO(editFormData.ngayBatDau) : undefined,
          ngayKetThuc: editFormData.ngayKetThuc ? formatDateISO(editFormData.ngayKetThuc) : undefined,
          trangThai: editFormData.trangThai
        };
        await updateDotThu(row.maDotThu!, updateData);
        await loadDotThu();
        setEditRowId(null);
        setEditFormData({
          tenDotThu: '',
          ngayBatDau: '',
          ngayKetThuc: '',
          trangThai: 'DANG_DIEN_RA'
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating dot thu:', err);
      }
    } else {
      setEditRowId(row.maDotThu!);
      setEditFormData({
        tenDotThu: row.tenDotThu,
        ngayBatDau: row.ngayBatDau ? formatDateDisplay(row.ngayBatDau) : '',
        ngayKetThuc: row.ngayKetThuc ? formatDateDisplay(row.ngayKetThuc) : '',
        trangThai: row.trangThai || 'DANG_DIEN_RA'
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa đợt thu này?')) {
      try {
        await deleteDotThu(id);
        await loadDotThu();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            tenDotThu: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            trangThai: 'DANG_DIEN_RA'
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting dot thu:', err);
      }
    }
  };

  // Handle add new click
  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      tenDotThu: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      trangThai: 'DANG_DIEN_RA'
    });
  };

  // Handle edit input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new row input change
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save new row
  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.tenDotThu.trim()) {
      alert('Vui lòng nhập tên đợt thu.');
      return;
    }
    if (!newRowData.ngayBatDau?.trim()) {
      alert('Vui lòng nhập ngày bắt đầu.');
      return;
    }
    if (!newRowData.trangThai?.trim()) {
      alert('Vui lòng chọn trạng thái.');
      return;
    }

    try {
      const newDotThu: DotThu = {
        tenDotThu: newRowData.tenDotThu,
        ngayBatDau: newRowData.ngayBatDau ? formatDateISO(newRowData.ngayBatDau) : undefined,
        ngayKetThuc: newRowData.ngayKetThuc ? formatDateISO(newRowData.ngayKetThuc) : undefined,
        trangThai: newRowData.trangThai
      };
      await createDotThu(newDotThu);
      await loadDotThu();
      setAddingNew(false);
      setNewRowData({
        tenDotThu: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        trangThai: 'DANG_DIEN_RA'
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo đợt thu: ' + (err.response?.data?.message || err.message));
      console.error('Error creating dot thu:', err);
    }
  };

  // Cancel new row
  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      tenDotThu: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      trangThai: 'DANG_DIEN_RA'
    });
  };

  // Handle search
  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredData(data); // Reset to full data if search keyword is empty
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = data.filter(item => {
      const fields = [
        item.maDotThu?.toString() || '',
        item.tenDotThu,
        formatDateDisplay(item.ngayBatDau),
        formatDateDisplay(item.ngayKetThuc),
        getTrangThaiLabel(item.trangThai)
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredData(filtered);
      setHighlightedRowId(filtered[0].maDotThu!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].maDotThu}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredData([]);
      alert('Không tìm thấy đợt thu phù hợp.');
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredData(data); // Reset to full data when search input is cleared
    }
  };

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getSoKhoanThu = (maDotThu?: number, khoanThus?: KhoanThu[]): string => {
    return khoanThus ? khoanThus.length.toString() : '0';
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
              onClick={loadDotThu}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đợt thu</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã đợt thu</option>
                <option value="1">Tên đợt thu</option>
                <option value="2">Ngày bắt đầu</option>
                <option value="3">Ngày kết thúc</option>
                <option value="4">Trạng thái</option>
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
              <span>Thêm đợt thu</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã đợt thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên đợt thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày kết thúc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map(row => ( // Use filteredData instead of data
                  <tr
                    key={row.maDotThu}
                    id={`row-${row.maDotThu}`}
                    className={`hover:bg-gray-50 ${highlightedRowId === row.maDotThu ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{row.maDotThu}</td>
                    {editRowId === row.maDotThu ? (
                      <>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="tenDotThu" 
                            value={editFormData.tenDotThu} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="ngayBatDau" 
                            value={editFormData.ngayBatDau || ''} 
                            onChange={handleEditChange} 
                            placeholder="DD/MM/YYYY"
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="ngayKetThuc" 
                            value={editFormData.ngayKetThuc || ''} 
                            onChange={handleEditChange} 
                            placeholder="DD/MM/YYYY"
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            name="trangThai" 
                            value={editFormData.trangThai || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          >
                            {trangThaiOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getSoKhoanThu(row.maDotThu, row.khoanThus)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.tenDotThu}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayBatDau)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayKetThuc)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTrangThaiColor(row.trangThai)}`}>
                            {getTrangThaiLabel(row.trangThai)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getSoKhoanThu(row.maDotThu, row.khoanThus)}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => handleEditClick(row)}
                          title={editRowId === row.maDotThu ? "Lưu" : "Chỉnh sửa"}
                        >
                          {editRowId === row.maDotThu ? <FaSave /> : <FaPen />}
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          onClick={() => handleDeleteClick(row.maDotThu!)}
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
                        name="tenDotThu" 
                        placeholder="Tên đợt thu" 
                        value={newRowData.tenDotThu} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="ngayBatDau" 
                        placeholder="DD/MM/YYYY" 
                        value={newRowData.ngayBatDau || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="ngayKetThuc" 
                        placeholder="DD/MM/YYYY" 
                        value={newRowData.ngayKetThuc || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        name="trangThai" 
                        value={newRowData.trangThai || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded"
                      >
                        {trangThaiOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">0</td>
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
              Tổng cộng: {filteredData.length} đợt thu {/* Updated to use filteredData.length */}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLDotThu;