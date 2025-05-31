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
  NhanKhau, 
  fetchAllNhanKhau, 
  createNhanKhau, 
  updateNhanKhau, 
  deleteNhanKhau 
} from '../../api/NhanKhauApi';

interface EditFormData {
  hoTen: string;
  ngaySinh: string; // Use string for input consistency
  gioiTinh: boolean;
  cmnd: string;
  qhVoiChuHo: string;
  trangThai: string;
  hoKhau: { maHoKhau: number };
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

const gioiTinhOptions = [
  { value: true, label: 'Nam' },
  { value: false, label: 'Nữ' }
];

const getGioiTinhLabel = (gioiTinh?: boolean): string => {
  const option = gioiTinhOptions.find(opt => opt.value === gioiTinh);
  return option ? option.label : 'Không xác định';
};

const QLNhanKhau: React.FC = () => {
  const [data, setData] = useState<NhanKhau[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: true,
    cmnd: '',
    qhVoiChuHo: '',
    trangThai: '',
    hoKhau: { maHoKhau: 0 }
  });

  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: true,
    cmnd: '',
    qhVoiChuHo: '',
    trangThai: '',
    hoKhau: { maHoKhau: 0 }
  });

  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data from API
  useEffect(() => {
    loadNhanKhau();
  }, []);

  const loadNhanKhau = async () => {
    try {
      setLoading(true);
      const response = await fetchAllNhanKhau();
      console.log(response.data);
      
      setData(response.data);
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading nhan khau:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = async (row: NhanKhau): Promise<void> => {
    if (editRowId === row.maNhanKhau) {
      // Save changes
      try {
        const updateData: NhanKhau = {
          ...editFormData,
          maNhanKhau: row.maNhanKhau,
          ngaySinh: formatDateISO(editFormData.ngaySinh)
        };
        
        await updateNhanKhau(row.maNhanKhau!, updateData);
        await loadNhanKhau();
        setEditRowId(null);
        setEditFormData({
          hoTen: '',
          ngaySinh: '',
          gioiTinh: true,
          cmnd: '',
          qhVoiChuHo: '',
          trangThai: '',
          hoKhau: { maHoKhau: 0 }
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating nhan khau:', err);
      }
    } else {
      // Start editing
      setEditRowId(row.maNhanKhau!);
      setEditFormData({
        hoTen: row.hoTen,
        ngaySinh: row.ngaySinh,
        gioiTinh: row.gioiTinh,
        cmnd: row.cmnd || '',
        qhVoiChuHo: row.qhVoiChuHo || '',
        trangThai: row.trangThai || '',
        hoKhau: { maHoKhau: row.hoKhau?.maHoKhau ?? 0 }
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa nhân khẩu này?')) {
      try {
        await deleteNhanKhau(id);
        await loadNhanKhau();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            hoTen: '',
            ngaySinh: '',
            gioiTinh: true,
            cmnd: '',
            qhVoiChuHo: '',
            trangThai: '',
            hoKhau: { maHoKhau: 0 }
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting nhan khau:', err);
      }
    }
  };

  // Handle edit input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'gioiTinh' ? value === 'true' : name === 'maHoKhau' ? { maHoKhau: parseInt(value) } : value
    }));
  };

  // Handle add new click
  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      hoTen: '',
      ngaySinh: '',
      gioiTinh: true,
      cmnd: '',
      qhVoiChuHo: '',
      trangThai: '',
      hoKhau: { maHoKhau: 1 }
    });
  };

  // Handle new row input change
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: name === 'gioiTinh' ? value === 'true' : name === 'maHoKhau' ? { maHoKhau: parseInt(value) } : value
    }));
  };

  // Save new row
  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.hoTen.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    if (!newRowData.ngaySinh.trim()) {
      alert('Vui lòng nhập ngày sinh.');
      return;
    }
    if (!newRowData.cmnd.trim()) {
      alert('Vui lòng nhập CMND/CCCD.');
      return;
    }
    if (!newRowData.qhVoiChuHo.trim()) {
      alert('Vui lòng nhập quan hệ với chủ hộ.');
      return;
    }
    if (!newRowData.trangThai.trim()) {
      alert('Vui lòng nhập trạng thái.');
      return;
    }
    if (!newRowData.hoKhau.maHoKhau) {
      alert('Vui lòng chọn hộ khẩu.');
      return;
    }

    try {
      const newNhanKhau: NhanKhau = {
        hoTen: newRowData.hoTen,
        ngaySinh: formatDateISO(newRowData.ngaySinh),
        gioiTinh: newRowData.gioiTinh,
        cmnd: newRowData.cmnd,
        qhVoiChuHo: newRowData.qhVoiChuHo,
        trangThai: newRowData.trangThai,
        hoKhau: { maHoKhau: newRowData.hoKhau.maHoKhau }
      };
      
      await createNhanKhau(newNhanKhau);
      await loadNhanKhau();
      setAddingNew(false);
      setNewRowData({
        hoTen: '',
        ngaySinh: '',
        gioiTinh: true,
        cmnd: '',
        qhVoiChuHo: '',
        trangThai: '',
        hoKhau: { maHoKhau: 0 }
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo nhân khẩu: ' + (err.response?.data?.message || err.message));
      console.error('Error creating nhan khau:', err);
    }
  };

  // Cancel new row
  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      hoTen: '',
      ngaySinh: '',
      gioiTinh: true,
      cmnd: '',
      qhVoiChuHo: '',
      trangThai: '',
      hoKhau: { maHoKhau: 0 }
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
        item.maNhanKhau?.toString() || '',
        item.hoTen,
        item.cmnd || '',
        getGioiTinhLabel(item.gioiTinh),
        item.qhVoiChuHo || '',
        item.trangThai || '',
        item.hoKhau?.maHoKhau.toString() || ''
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    
    if (found) {
      setHighlightedRowId(found.maNhanKhau!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.maNhanKhau}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
              onClick={loadNhanKhau}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý nhân khẩu</h2>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã nhân khẩu</option>
                <option value="1">Họ và tên</option>
                <option value="2">CMND/CCCD</option>
                <option value="3">Giới tính</option>
                <option value="4">Quan hệ với chủ hộ</option>
                <option value="5">Trạng thái</option>
                <option value="6">Mã hộ khẩu</option>
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
              <span>Thêm nhân khẩu</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã nhân khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Họ và tên</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày sinh</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Giới tính</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">CMND/CCCD</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quan hệ với chủ hộ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(row => (
                  <tr
                    key={row.maNhanKhau}
                    id={`row-${row.maNhanKhau}`}
                    className={`hover:bg-gray-50 ${highlightedRowId === row.maNhanKhau ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{row.maNhanKhau}</td>
                    {editRowId === row.maNhanKhau ? (
                      <>
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
                            type="date" 
                            name="ngaySinh" 
                            value={editFormData.ngaySinh} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            name="gioiTinh" 
                            value={editFormData.gioiTinh.toString()} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          >
                            {gioiTinhOptions.map(option => (
                              <option key={option.label} value={option.value.toString()}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="cmnd" 
                            value={editFormData.cmnd} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="qhVoiChuHo" 
                            value={editFormData.qhVoiChuHo} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="trangThai" 
                            value={editFormData.trangThai} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            name="maHoKhau" 
                            value={editFormData.hoKhau.maHoKhau} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.hoTen}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngaySinh)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getGioiTinhLabel(row.gioiTinh)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.cmnd || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.qhVoiChuHo || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.trangThai || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.hoKhau?.maHoKhau || '-'}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => handleEditClick(row)}
                          title={editRowId === row.maNhanKhau ? "Lưu" : "Chỉnh sửa"}
                        >
                          {editRowId === row.maNhanKhau ? <FaSave /> : <FaPen />}
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          onClick={() => handleDeleteClick(row.maNhanKhau!)}
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
                        name="hoTen" 
                        placeholder="Họ và tên" 
                        value={newRowData.hoTen} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="date" 
                        name="ngaySinh" 
                        value={newRowData.ngaySinh} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        name="gioiTinh" 
                        value={newRowData.gioiTinh.toString()} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded"
                      >
                        {gioiTinhOptions.map(option => (
                          <option key={option.label} value={option.value.toString()}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="cmnd" 
                        placeholder="CMND/CCCD" 
                        value={newRowData.cmnd} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="qhVoiChuHo" 
                        placeholder="Quan hệ với chủ hộ" 
                        value={newRowData.qhVoiChuHo} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        name="trangThai" 
                        placeholder="Trạng thái" 
                        value={newRowData.trangThai} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        name="maHoKhau" 
                        placeholder="Mã hộ khẩu" 
                        value={newRowData.hoKhau.maHoKhau} 
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

export default QLNhanKhau;