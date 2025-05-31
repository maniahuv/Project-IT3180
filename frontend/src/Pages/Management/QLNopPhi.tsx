import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaPen, FaTrashAlt, FaSave, FaTimes } from 'react-icons/fa';
import MainLayout from '../../Layout/MainLayout';
import { NopPhi, fetchAllNopPhi, createNopPhi, updateNopPhi, deleteNopPhi } from '../../api/NopPhiApi';
import { TaiKhoan, fetchAllTaiKhoan } from '../../api/TaiKhoanApi';
import { HoKhau, fetchAllHoKhau } from '../../api/HoKhauApi';
import { KhoanThu, fetchAllKhoanThu } from '../../api/KhoanThuApi';

interface EditFormData {
  ngayThu: string;
  soTien: number;
  nguoiNop: string;
  nguoiThuId: number;
  hoKhauId: number;
  khoanThuId: number;
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
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return dateStr;
};

const QLNopPhi: React.FC = () => {
  const [data, setData] = useState<NopPhi[]>([]);
  const [taiKhoans, setTaiKhoans] = useState<TaiKhoan[]>([]);
  const [hoKhaus, setHoKhaus] = useState<HoKhau[]>([]);
  const [khoanThus, setKhoanThus] = useState<KhoanThu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    ngayThu: '',
    soTien: 0,
    nguoiNop: '',
    nguoiThuId: 0,
    hoKhauId: 0,
    khoanThuId: 0
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    ngayThu: '',
    soTien: 0,
    nguoiNop: '',
    nguoiThuId: 0,
    hoKhauId: 0,
    khoanThuId: 0
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data
  useEffect(() => {
    loadNopPhi();
    loadTaiKhoan();
    loadHoKhau();
    loadKhoanThu();
  }, []);

  const loadNopPhi = async () => {
    try {
      setLoading(true);
      const response = await fetchAllNopPhi();
      console.log('Nop phi data loaded:', response.data);
      setData(response.data);
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading nop phi:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTaiKhoan = async () => {
    try {
      const response = await fetchAllTaiKhoan();
      setTaiKhoans(response.data);
    } catch (err: any) {
      console.error('Error loading tai khoan:', err);
    }
  };

  const loadHoKhau = async () => {
    try {
      const response = await fetchAllHoKhau();
      setHoKhaus(response.data);
    } catch (err: any) {
      console.error('Error loading ho khau:', err);
    }
  };

  const loadKhoanThu = async () => {
    try {
      const response = await fetchAllKhoanThu();
      setKhoanThus(response.data);
    } catch (err: any) {
      console.error('Error loading khoan thu:', err);
    }
  };

  // Handle edit click
  const handleEditClick = async (row: NopPhi): Promise<void> => {
    if (editRowId === row.id) {
      try {
        const updateData: NopPhi = {
          ngayThu: formatDateISO(editFormData.ngayThu),
          soTien: editFormData.soTien,
          nguoiNop: editFormData.nguoiNop,
          nguoiThu: { id: editFormData.nguoiThuId },
          hoKhau: { maHoKhau: editFormData.hoKhauId },
          khoanThu: { maKhoanThu: editFormData.khoanThuId }
        };
        await updateNopPhi(row.id!, updateData);
        await loadNopPhi();
        setEditRowId(null);
        setEditFormData({
          ngayThu: '',
          soTien: 0,
          nguoiNop: '',
          nguoiThuId: 0,
          hoKhauId: 0,
          khoanThuId: 0
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating nop phi:', err);
      }
    } else {
      setEditRowId(row.id!);
      setEditFormData({
        ngayThu: formatDateDisplay(row.ngayThu || ''),
        soTien: row.soTien || 0,
        nguoiNop: row.nguoiNop || '',
        nguoiThuId: row.nguoiThu?.id || 0,
        hoKhauId: row.hoKhau?.maHoKhau || 0,
        khoanThuId: row.khoanThu?.maKhoanThu || 0
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa nộp phí này?')) {
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
            hoKhauId: 0,
            khoanThuId: 0
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting nop phi:', err);
      }
    }
  };

  // Handle edit input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'soTien' || name === 'nguoiThuId' || name === 'hoKhauId' || name === 'khoanThuId' ? 
        (value ? Number(value) : 0) : value
    }));
  };

  // Handle add new click
  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      ngayThu: '',
      soTien: 0,
      nguoiNop: '',
      nguoiThuId: 0,
      hoKhauId: 0,
      khoanThuId: 0
    });
  };

  // Handle new row input change
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: name === 'soTien' || name === 'nguoiThuId' || name === 'hoKhauId' || name === 'khoanThuId' ? 
        (value ? Number(value) : 0) : value
    }));
  };

  // Save new row
  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.ngayThu.trim()) {
      alert('Vui lòng nhập ngày thu.');
      return;
    }
    if (!newRowData.soTien || newRowData.soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (!newRowData.nguoiNop.trim()) {
      alert('Vui lòng nhập người nộp.');
      return;
    }
    if (!newRowData.nguoiThuId) {
      alert('Vui lòng chọn người thu.');
      return;
    }
    if (!newRowData.hoKhauId) {
      alert('Vui lòng chọn hộ khẩu.');
      return;
    }
    if (!newRowData.khoanThuId) {
      alert('Vui lòng chọn khoản thu.');
      return;
    }

    try {
      const newNopPhi: NopPhi = {
        ngayThu: formatDateISO(newRowData.ngayThu),
        soTien: newRowData.soTien,
        nguoiNop: newRowData.nguoiNop,
        nguoiThu: { id: newRowData.nguoiThuId },
        hoKhau: { maHoKhau: newRowData.hoKhauId },
        khoanThu: { maKhoanThu: newRowData.khoanThuId }
      };
      await createNopPhi(newNopPhi);
      await loadNopPhi();
      setAddingNew(false);
      setNewRowData({
        ngayThu: '',
        soTien: 0,
        nguoiNop: '',
        nguoiThuId: 0,
        hoKhauId: 0,
        khoanThuId: 0
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo nộp phí: ' + (err.response?.data?.message || err.message));
      console.error('Error creating nop phi:', err);
    }
  };

  // Cancel new row
  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      ngayThu: '',
      soTien: 0,
      nguoiNop: '',
      nguoiThuId: 0,
      hoKhauId: 0,
      khoanThuId: 0
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
        formatDateDisplay(item.ngayThu || ''),
        item.soTien?.toString() || '',
        item.nguoiNop || ''
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (found) {
      setHighlightedRowId(found.id!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy nộp phí phù hợp.');
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
              onClick={loadNopPhi}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý nộp phí</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">ID</option>
                <option value="1">Ngày thu</option>
                <option value="2">Số tiền</option>
                <option value="3">Người nộp</option>
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Người nộp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Người thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Khoản thu</th>
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
                            name="ngayThu"
                            value={editFormData.ngayThu}
                            onChange={handleEditChange}
                            placeholder="dd/mm/yyyy"
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            name="soTien"
                            value={editFormData.soTien || ''}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            name="nguoiNop"
                            value={editFormData.nguoiNop}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            name="nguoiThuId"
                            value={editFormData.nguoiThuId}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="0">Chọn người thu</option>
                            {taiKhoans.map(tk => (
                              <option key={tk.id} value={tk.id}>
                                {tk.hoTen}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            name="hoKhauId"
                            value={editFormData.hoKhauId}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="0">Chọn hộ khẩu</option>
                            {hoKhaus.map(hk => (
                              <option key={hk.maHoKhau} value={hk.maHoKhau}>
                                {hk.tenChuHo}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            name="khoanThuId"
                            value={editFormData.khoanThuId}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="0">Chọn khoản thu</option>
                            {khoanThus.map(kt => (
                              <option key={kt.maKhoanThu} value={kt.maKhoanThu}>
                                {kt.tenKhoanThu}
                              </option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayThu || '')}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.soTien}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.nguoiNop}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.nguoiThu?.hoTen || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.hoKhau?.tenChuHo || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.khoanThu?.tenKhoanThu || '-'}</td>
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
                        name="ngayThu"
                        placeholder="dd/mm/yyyy"
                        value={newRowData.ngayThu}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="soTien"
                        value={newRowData.soTien || ''}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name="nguoiNop"
                        value={newRowData.nguoiNop}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        name="nguoiThuId"
                        value={newRowData.nguoiThuId}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="0">Chọn người thu</option>
                        {taiKhoans.map(tk => (
                          <option key={tk.id} value={tk.id}>
                            {tk.hoTen}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        name="hoKhauId"
                        value={newRowData.hoKhauId}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="0">Chọn hộ khẩu</option>
                        {hoKhaus.map(hk => (
                          <option key={hk.maHoKhau} value={hk.maHoKhau}>
                            {hk.tenChuHo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        name="khoanThuId"
                        value={newRowData.khoanThuId}
                        onChange={handleNewChange}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="0">Chọn khoản thu</option>
                        {khoanThus.map(kt => (
                          <option key={kt.maKhoanThu} value={kt.maKhoanThu}>
                            {kt.tenKhoanThu}
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
              Tổng cộng: {data.length} nộp phí
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLNopPhi;
