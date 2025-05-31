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
  NopPhi,
  fetchAllNopPhi,
  createNopPhi,
  updateNopPhi,
  deleteNopPhi
} from '../../api/NopPhiApi';

interface EditFormData {
  ngayThu: string;
  soTien: number;
  nguoiNop: string;
  nguoiThuId: number;
  hoKhauMaHoKhau: number;
  khoanThuMaKhoanThu: number;
}

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

const QLNopPhi: React.FC = () => {
  const [data, setData] = useState<NopPhi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    ngayThu: '',
    soTien: 0,
    nguoiNop: '',
    nguoiThuId: 0,
    hoKhauMaHoKhau: 0,
    khoanThuMaKhoanThu: 0
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    ngayThu: '',
    soTien: 0,
    nguoiNop: '',
    nguoiThuId: 0,
    hoKhauMaHoKhau: 0,
    khoanThuMaKhoanThu: 0
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    loadNopPhi();
  }, []);

  const loadNopPhi = async () => {
    try {
      setLoading(true);
      const response = await fetchAllNopPhi();
      console.log('NopPhi response:', response.data);
   
      setData(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error loading nop phi:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu.');
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (row: NopPhi): Promise<void> => {
    if (!row.id) return;
    if (editRowId === row.id) {
      try {
        const updateData: NopPhi = {
          id: row.id,
          ngayThu: editFormData.ngayThu ? formatDateISO(editFormData.ngayThu) : undefined,
          soTien: editFormData.soTien,
          nguoiNop: editFormData.nguoiNop || undefined,
          nguoiThu: { id: editFormData.nguoiThuId },
          hoKhau: { maHoKhau: editFormData.hoKhauMaHoKhau },
          khoanThu: { maKhoanThu: editFormData.khoanThuMaKhoanThu }
        };
        await updateNopPhi(row.id, updateData);
        await loadNopPhi();
        setEditRowId(null);
        setEditFormData({
          ngayThu: '',
          soTien: 0,
          nguoiNop: '',
          nguoiThuId: 0,
          hoKhauMaHoKhau: 0,
          khoanThuMaKhoanThu: 0
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating nop phi:', err);
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
        }
      }
    } else {
      setEditRowId(row.id);
      setEditFormData({
        ngayThu: row.ngayThu ? formatDateDisplay(row.ngayThu) : '',
        soTien: row.soTien || 0,
        nguoiNop: row.nguoiNop || '',
        nguoiThuId: row.nguoiThu?.id || 0,
        hoKhauMaHoKhau: row.hoKhau?.maHoKhau || 0,
        khoanThuMaKhoanThu: row.khoanThu?.maKhoanThu || 0
      });
    }
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      try {
        await deleteNopPhi(id);
        await loadNopPhi();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            ngayThu: '',
            soTien: 0,
            nguoiNop: '',
            nguoiThuId: 0,
            hoKhauMaHoKhau: 0,
            khoanThuMaKhoanThu: 0
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting nop phi:', err);
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
        }
      }
    }
  };

  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      ngayThu: '',
      soTien: 0,
      nguoiNop: '',
      nguoiThuId: 0,
      hoKhauMaHoKhau: 0,
      khoanThuMaKhoanThu: 0
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'soTien' || name === 'nguoiThuId' || name === 'hoKhauMaHoKhau' || name === 'khoanThuMaKhoanThu' ? Number(value) : value
    }));
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: name === 'soTien' || name === 'nguoiThuId' || name === 'hoKhauMaHoKhau' || name === 'khoanThuMaKhoanThu' ? Number(value) : value
    }));
  };

  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.ngayThu.trim()) {
      alert('Vui lòng nhập ngày thu.');
      return;
    }
    if (newRowData.soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (!newRowData.nguoiNop.trim()) {
      alert('Vui lòng nhập người nộp.');
      return;
    }
    if (newRowData.nguoiThuId <= 0) {
      alert('Vui lòng nhập mã người thu hợp lệ.');
      return;
    }
    if (newRowData.hoKhauMaHoKhau <= 0) {
      alert('Vui lòng nhập mã hộ khẩu hợp lệ.');
      return;
    }
    if (newRowData.khoanThuMaKhoanThu <= 0) {
      alert('Vui lòng nhập mã khoản thu hợp lệ.');
      return;
    }

    try {
      const newNopPhi: NopPhi = {
        ngayThu: formatDateISO(newRowData.ngayThu),
        soTien: newRowData.soTien,
        nguoiNop: newRowData.nguoiNop,
        nguoiThu: { id: newRowData.nguoiThuId },
        hoKhau: { maHoKhau: newRowData.hoKhauMaHoKhau },
        khoanThu: { maKhoanThu: newRowData.khoanThuMaKhoanThu }
      };
      await createNopPhi(newNopPhi);
      await loadNopPhi();
      setAddingNew(false);
      setNewRowData({
        ngayThu: '',
        soTien: 0,
        nguoiNop: '',
        nguoiThuId: 0,
        hoKhauMaHoKhau: 0,
        khoanThuMaKhoanThu: 0
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo bản ghi: ' + (err.response?.data?.message || err.message));
      console.error('Error creating nop phi:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
      }
    }
  };

  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      ngayThu: '',
      soTien: 0,
      nguoiNop: '',
      nguoiThuId: 0,
      hoKhauMaHoKhau: 0,
      khoanThuMaKhoanThu: 0
    });
  };

  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const found = data.find(item => {
      const fields = [
        item.id?.toString() || '',
        formatDateDisplay(item.ngayThu),
        item.soTien?.toString() || '',
        item.nguoiNop || '',
        item.nguoiThu?.id.toString() || '',
        item.hoKhau?.maHoKhau.toString() || '',
        item.khoanThu?.maKhoanThu.toString() || ''
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (found && found.id) {
      setHighlightedRowId(found.id);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy bản ghi phù hợp.');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
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
              onClick={handleLogout}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Đăng nhập lại
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Nộp Phí</h2>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchCriteria}
              onChange={e => setSearchCriteria(e.target.value)}
            >
              <option value="0">Mã bản ghi</option>
              <option value="1">Ngày thu</option>
              <option value="2">Số tiền</option>
              <option value="3">Người nộp</option>
              <option value="4">Mã người thu</option>
              <option value="5">Mã hộ khẩu</option>
              <option value="6">Mã khoản thu</option>
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã bản ghi</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày thu</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Người nộp</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã người thu</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã hộ khẩu</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã khoản thu</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map(row => (
                <tr
                  key={row.id || Math.random()}
                  id={`row-${row.id}`}
                  className={`hover:bg-gray-50 ${highlightedRowId === row.id ? 'bg-yellow-100' : ''}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{row.id || '-'}</td>
                  {editRowId === row.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="ngayThu"
                          value={editFormData.ngayThu || ''}
                          onChange={handleEditChange}
                          placeholder="DD/MM/YYYY"
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          name="soTien"
                          value={editFormData.soTien || 0}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="nguoiNop"
                          value={editFormData.nguoiNop || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          name="nguoiThuId"
                          value={editFormData.nguoiThuId || 0}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          name="hoKhauMaHoKhau"
                          value={editFormData.hoKhauMaHoKhau || 0}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          name="khoanThuMaKhoanThu"
                          value={editFormData.khoanThuMaKhoanThu || 0}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayThu)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.soTien?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.nguoiNop || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.nguoiThu?.id || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.hoKhau?.maHoKhau || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.khoanThu?.maKhoanThu || '-'}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        onClick={() => handleEditClick(row)}
                        title={editRowId === row.id ? "Lưu" : "Chỉnh sửa"}
                        disabled={!row.id}
                      >
                        {editRowId === row.id ? <FaSave /> : <FaPen />}
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={() => row.id && handleDeleteClick(row.id)}
                        title="Xóa"
                        disabled={!row.id}
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
                      name="ngayThu"
                      placeholder="DD/MM/YYYY"
                      value={newRowData.ngayThu || ''}
                      onChange={handleNewChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      name="soTien"
                      placeholder="Số tiền"
                      value={newRowData.soTien || 0}
                      onChange={handleNewChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      name="nguoiNop"
                      placeholder="Người nộp"
                      value={newRowData.nguoiNop || ''}
                      onChange={handleNewChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      name="nguoiThuId"
                      placeholder="Mã người thu"
                      value={newRowData.nguoiThuId || 0}
                      onChange={handleNewChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      name="hoKhauMaHoKhau"
                      placeholder="Mã hộ khẩu"
                      value={newRowData.hoKhauMaHoKhau || 0}
                      onChange={handleNewChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      name="khoanThuMaKhoanThu"
                      placeholder="Mã khoản thu"
                      value={newRowData.khoanThuMaKhoanThu || 0}
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
            Tổng cộng: {data.length} bản ghi
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default QLNopPhi;