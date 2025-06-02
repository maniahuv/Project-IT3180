import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import MainLayout from '../../Layout/MainLayout';
import { LichSuHoKhau, fetchAllLichSuHoKhau } from '../../api/LichSuHoKhauApi';

const loaiThayDoiOptions = [
  { value: 1, label: 'Thêm vào hộ khẩu' },
  { value: 2, label: 'Xóa khỏi hộ khẩu' }
];

const getLoaiThayDoiLabel = (loai?: number): string => {
  const option = loaiThayDoiOptions.find(opt => opt.value === loai);
  return option ? option.label : 'Không xác định';
};

// Utility function to format date for display
const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
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

  // Fetch data from API
  useEffect(() => {
    loadData();
  }, []);

  // Update filteredData when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllLichSuHoKhau();
      console.log('LichSuHoKhau data loaded:', response.data);
      setData(response.data);
      setFilteredData(response.data);
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

  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredData(data);
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = data.filter(item => {
      const fields = [
        item.id?.toString() || '',
        getLoaiThayDoiLabel(item.loaiThayDoi),
        formatDateDisplay(item.thoiGian),
        item.hoKhau?.maHoKhau?.toString() || '',
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
      setFilteredData(data);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý lịch sử hộ khẩu</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã lịch sử</option>
                <option value="1">Loại thay đổi</option>
                <option value="2">Thời gian</option>
                <option value="3">Mã hộ khẩu</option>
                <option value="4">Mã nhân khẩu</option>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại thay đổi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thời gian</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã nhân khẩu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map(row => (
                  <tr
                    key={row.id}
                    id={`row-${row.id}`}
                    className={`hover:bg-gray-50 ${highlightedRowId === row.id ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          row.loaiThayDoi === 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {getLoaiThayDoiLabel(row.loaiThayDoi)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.thoiGian)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.hoKhau?.maHoKhau || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.nhanKhau?.maNhanKhau || '-'}</td>
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
                onChange={e => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
            </div>
            <div className="text-sm text-gray-700">
              Tổng cộng: {filteredData.length} bản ghi
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLLichSuHoKhau;