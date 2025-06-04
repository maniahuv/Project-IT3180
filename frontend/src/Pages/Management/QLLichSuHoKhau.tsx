import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import MainLayout from '../../Layout/MainLayout';
import { LichSuHoKhau, fetchAllLichSuHoKhau } from '../../api/LichSuHoKhauApi';

// Loại thay đổi mapping
const loaiThayDoiOptions = [
  { value: 1, label: 'Tạo mới nhân khẩu' },
  { value: 2, label: 'Chuyển nhân khẩu' },
  { value: 3, label: 'Xóa khỏi hộ khẩu' },
];

const getLoaiThayDoiLabel = (loaiThayDoi: number): string => {
  const option = loaiThayDoiOptions.find(opt => opt.value === loaiThayDoi);
  return option ? option.label : 'Không xác định';
};

const QLLichSuHoKhau: React.FC = () => {
  const [data, setData] = useState<LichSuHoKhau[]>([]);
  const [filteredData, setFilteredData] = useState<LichSuHoKhau[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch data from API
  useEffect(() => {
    loadLichSuHoKhau();
  }, []);

  // Update filteredData when data changes
  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data]);

  const loadLichSuHoKhau = async () => {
    try {
      setLoading(true);
      const response = await fetchAllLichSuHoKhau();
      console.log('LichSuHoKhau data loaded:', response.data);
      setData(response.data);
      setFilteredData(response.data);
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading lich su ho khau:', err);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredData(data);
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = data.filter(item => {
      const fields = [
        item.maLichSu?.toString() || '',
        item.maHoKhau?.toString() || '',
        item.maNhanKhau?.toString() || '',
        getLoaiThayDoiLabel(item.loaiThayDoi),
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredData(filtered);
      setCurrentPage(1);
      setHighlightedRowId(filtered[0].maLichSu!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].maLichSu}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredData([]);
      alert('Không tìm thấy lịch sử hộ khẩu phù hợp.');
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredData(data);
      setCurrentPage(1);
    }
  };

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
              onClick={loadLichSuHoKhau}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý lịch sử hộ khẩu</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã lịch sử</option>
                <option value="1">Mã hộ khẩu</option>
                <option value="2">Mã nhân khẩu</option>
                <option value="3">Loại thay đổi</option>
              </select>
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKeyword}
                onChange={handleSearchChange}
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
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã lịch sử</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã nhân khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại thay đổi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map(row => (
                  <tr
                    key={row.maLichSu}
                    id={`row-${row.maLichSu}`}
                    className={`hover:bg-gray-50 ${highlightedRowId === row.maLichSu ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{row.maLichSu}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.maHoKhau}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.maNhanKhau || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        row.loaiThayDoi === 1 ? 'bg-green-100 text-green-800' : 
                        row.loaiThayDoi === 2 ? 'bg-yellow-100 text-yellow-800' : 
                        row.loaiThayDoi === 3 ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getLoaiThayDoiLabel(row.loaiThayDoi)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(row.thoiGian).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Hiển thị</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span className="text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
            <div className="text-sm text-gray-700">
              Tổng cộng: {filteredData.length} lịch sử
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLLichSuHoKhau;