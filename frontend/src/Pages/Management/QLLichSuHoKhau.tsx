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
  LichSuHoKhau, 
  fetchAllLichSuHoKhau, 
  createLichSuHoKhau, 
  updateLichSuHoKhau, 
  deleteLichSuHoKhau 
} from '../../api/LichSuHoKhai';
import { HoKhau, fetchAllHoKhau } from '../../api/HoKhauApi';
import { NhanKhau, fetchAllNhanKhau } from '../../api/NhanKhauApi';

// Interface for form data
interface EditFormData {
  loaiThayDoi: number;
  thoiGian: string;
  maHoKhau: number;
  maNhanKhau?: number;
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

const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
};

const QLLichSuHoKhau: React.FC = () => {
  const vaiTro = localStorage.getItem("vaiTro");
  const [data, setData] = useState<LichSuHoKhau[]>([]);
  const [filteredData, setFilteredData] = useState<LichSuHoKhau[]>([]);
  const [hoKhauData, setHoKhauData] = useState<HoKhau[]>([]);
  const [nhanKhauData, setNhanKhauData] = useState<NhanKhau[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    loaiThayDoi: 1,
    thoiGian: '',
    maHoKhau: 0,
    maNhanKhau: undefined
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    loaiThayDoi: 1,
    thoiGian: '',
    maHoKhau: 0,
    maNhanKhau: undefined
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    loadLichSuHoKhau();
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const loadLichSuHoKhau = async () => {
    try {
      setLoading(true);
      const response = await fetchAllLichSuHoKhau();
      let fetchedData: LichSuHoKhau[] = response.data;
      if (typeof response.data === 'string') {
        try {
          fetchedData = JSON.parse(response.data);
        } catch (parseError) {
          console.error('Error parsing response data:', parseError);
          setError('Dữ liệu trả về từ API không thể phân tích.');
          setData([]);
          setFilteredData([]);
          setLoading(false);
          return;
        }
      }

      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setFilteredData(fetchedData);
        console.log('Fetched lich su ho khau data:', fetchedData);
        setError('');
      } else {
        console.error('Response data is not an array:', fetchedData);
        setData([]);
        setFilteredData([]);
        setError('Dữ liệu trả về từ API không đúng định dạng.');
      }

      const hoKhauResponse = await fetchAllHoKhau();
      let hoKhauArray: HoKhau[] = [];
      if (typeof hoKhauResponse.data === 'string') {
        hoKhauArray = JSON.parse(hoKhauResponse.data);
      } else if (Array.isArray(hoKhauResponse.data)) {
        hoKhauArray = hoKhauResponse.data;
      }
      setHoKhauData(hoKhauArray);

      const nhanKhauResponse = await fetchAllNhanKhau();
      let nhanKhauArray: NhanKhau[] = [];
      if (typeof nhanKhauResponse.data === 'string') {
        nhanKhauArray = JSON.parse(nhanKhauResponse.data);
      } else if (Array.isArray(nhanKhauResponse.data)) {
        nhanKhauArray = nhanKhauResponse.data;
      }
      setNhanKhauData(nhanKhauArray);
    } catch (err: any) {
      console.error('Error loading lich su ho khau:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const getTenHoKhau = (maHoKhau?: number): string => {
    if (!maHoKhau) return '-';
    const hoKhau = hoKhauData.find(hk => hk.maHoKhau === maHoKhau);
    return hoKhau ? `${hoKhau.maHoKhau} - ${hoKhau.soNha}` : `${maHoKhau}`;
  };

  const getTenNhanKhau = (maNhanKhau?: number): string => {
    if (!maNhanKhau) return '-';
    const nhanKhau = nhanKhauData.find(nk => nk.maNhanKhau === maNhanKhau);
    return nhanKhau ? `${nhanKhau.maNhanKhau} - ${nhanKhau.hoTen}` : `${maNhanKhau}`;
  };

  const handleEditClick = async (row: LichSuHoKhau): Promise<void> => {
    if (editRowId === row.id) {
      try {
        const updateData: LichSuHoKhau = {
          id: row.id,
          loaiThayDoi: editFormData.loaiThayDoi,
          thoiGian: formatDateISO(editFormData.thoiGian),
          hoKhau: { maHoKhau: editFormData.maHoKhau },
          nhanKhau: editFormData.maNhanKhau ? { maNhanKhau: editFormData.maNhanKhau } : undefined
        };
        await updateLichSuHoKhau(row.id!, updateData);
        await loadLichSuHoKhau();
        setEditRowId(null);
        setEditFormData({
          loaiThayDoi: 1,
          thoiGian: '',
          maHoKhau: 0,
          maNhanKhau: undefined
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating lich su ho khau:', err);
      }
    } else {
      setEditRowId(row.id!);
      setEditFormData({
        loaiThayDoi: row.loaiThayDoi,
        thoiGian: formatDateDisplay(row.thoiGian),
        maHoKhau: row.hoKhau.maHoKhau,
        maNhanKhau: row.nhanKhau?.maNhanKhau
      });
    }
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa lịch sử này?')) {
      try {
        await deleteLichSuHoKhau(id);
        await loadLichSuHoKhau();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            loaiThayDoi: 1,
            thoiGian: '',
            maHoKhau: 0,
            maNhanKhau: undefined
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting lich su ho khau:', err);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: name === 'loaiThayDoi' || name === 'maHoKhau' || name === 'maNhanKhau' ? Number(value) : value 
    }));
  };

  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      loaiThayDoi: 1,
      thoiGian: '',
      maHoKhau: 0,
      maNhanKhau: undefined
    });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({ 
      ...prev, 
      [name]: name === 'loaiThayDoi' || name === 'maHoKhau' || name === 'maNhanKhau' ? Number(value) : value 
    }));
  };

  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.thoiGian.trim()) {
      alert('Vui lòng nhập thời gian.');
      return;
    }
    if (!newRowData.maHoKhau) {
      alert('Vui lòng chọn mã hộ khẩu.');
      return;
    }

    try {
      const newLichSu: LichSuHoKhau = {
        loaiThayDoi: newRowData.loaiThayDoi,
        thoiGian: formatDateISO(newRowData.thoiGian),
        hoKhau: { maHoKhau: newRowData.maHoKhau },
        nhanKhau: newRowData.maNhanKhau ? { maNhanKhau: newRowData.maNhanKhau } : undefined
      };
      await createLichSuHoKhau(newLichSu);
      await loadLichSuHoKhau();
      setAddingNew(false);
      setNewRowData({
        loaiThayDoi: 1,
        thoiGian: '',
        maHoKhau: 0,
        maNhanKhau: undefined
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo lịch sử: ' + (err.response?.data?.message || err.message));
      console.error('Error creating lich su ho khau:', err);
    }
  };

  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      loaiThayDoi: 1,
      thoiGian: '',
      maHoKhau: 0,
      maNhanKhau: undefined
    });
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
        item.loaiThayDoi.toString(),
        formatDateDisplay(item.thoiGian),
        getTenHoKhau(item.hoKhau?.maHoKhau),
        getTenNhanKhau(item.nhanKhau?.maNhanKhau)
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredData(filtered);
      setHighlightedRowId(filtered[0].id!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredData([]);
      alert('Không tìm thấy lịch sử phù hợp.');
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
                <option value="1">Loại thay đổi</option>
                <option value="2">Thời gian</option>
                <option value="3">Hộ khẩu</option>
                <option value="4">Nhân khẩu</option>
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

            <button
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                vaiTro === "3"
                  ? "bg-green-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleAddNewClick}
              disabled={vaiTro === "3"}
            >
              <FaPlus />
              <span>Thêm lịch sử</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã lịch sử</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại thay đổi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thời gian</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nhân khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
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
                    {editRowId === row.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            name="loaiThayDoi" 
                            value={editFormData.loaiThayDoi} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="thoiGian" 
                            value={editFormData.thoiGian} 
                            onChange={handleEditChange} 
                            placeholder="DD/MM/YYYY"
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            name="maHoKhau" 
                            value={editFormData.maHoKhau} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            name="maNhanKhau" 
                            value={editFormData.maNhanKhau || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.loaiThayDoi}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.thoiGian)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getTenHoKhau(row.hoKhau?.maHoKhau)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getTenNhanKhau(row.nhanKhau?.maNhanKhau)}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className={`p-2 rounded transition-colors ${
                            vaiTro === "3"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:bg-blue-50"
                          }`}
                          onClick={() => handleEditClick(row)}
                          title={editRowId === row.id ? "Lưu" : "Chỉnh sửa"}
                          disabled={vaiTro === "3"}
                        >
                          {editRowId === row.id ? <FaSave /> : <FaPen />}
                        </button>
                        <button
                          className={`p-2 rounded transition-colors ${
                            vaiTro === "3"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          onClick={() => handleDeleteClick(row.id!)}
                          title="Xóa"
                          disabled={vaiTro === "3"}
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
                        type="number" 
                        name="loaiThayDoi" 
                        placeholder="Loại thay đổi" 
                        value={newRowData.loaiThayDoi} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="thoiGian" 
                        placeholder="DD/MM/YYYY" 
                        value={newRowData.thoiGian} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        name="maHoKhau" 
                        placeholder="Mã hộ khẩu" 
                        value={newRowData.maHoKhau} 
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
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
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