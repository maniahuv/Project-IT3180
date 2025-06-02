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
  ngaySinh: string;
  gioiTinh: boolean;
  cmnd: string;
  qhVoiChuHo: string;
  trangThai: string;
  maHoKhau?: number;
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
  const vaiTro = localStorage.getItem("vaiTro");
  const [data, setData] = useState<NhanKhau[]>([]);
  const [filteredData, setFilteredData] = useState<NhanKhau[]>([]); // New state for filtered data
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
    maHoKhau: undefined
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: true,
    cmnd: '',
    qhVoiChuHo: '',
    trangThai: '',
    maHoKhau: undefined
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Fetch data from API
  useEffect(() => {
    loadNhanKhau();
  }, []);

  // Update filteredData when data changes
  useEffect(() => {
    setFilteredData(data); // Reset filteredData to original data when data changes
  }, [data]);

  const loadNhanKhau = async () => {
    try {
      setLoading(true);
      const response = await fetchAllNhanKhau();
      console.log('NhanKhau response:', response.data);
      setData(response.data);
      setFilteredData(response.data); // Initialize filteredData
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading nhan khau:', err);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = async (row: NhanKhau): Promise<void> => {
    if (editRowId === row.maNhanKhau) {
      try {
        const updateData: NhanKhau = {
          maNhanKhau: row.maNhanKhau,
          hoTen: editFormData.hoTen,
          ngaySinh: formatDateISO(editFormData.ngaySinh),
          gioiTinh: editFormData.gioiTinh,
          cmnd: editFormData.cmnd,
          qhVoiChuHo: editFormData.qhVoiChuHo,
          trangThai: editFormData.trangThai,
          maHoKhau: editFormData.maHoKhau
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
          maHoKhau: undefined
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating nhan khau:', err);
      }
    } else {
      setEditRowId(row.maNhanKhau!);
      setEditFormData({
        hoTen: row.hoTen,
        ngaySinh: formatDateDisplay(row.ngaySinh),
        gioiTinh: row.gioiTinh,
        cmnd: row.cmnd || '',
        qhVoiChuHo: row.qhVoiChuHo || '',
        trangThai: row.trangThai || '',
        maHoKhau: row.maHoKhau
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
            maHoKhau: undefined
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
      [name]: name === 'gioiTinh' ? value === 'true' : name === 'maHoKhau' ? (value ? Number(value) : undefined) : value
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
      maHoKhau: undefined
    });
  };

  // Handle new row input change
  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewRowData(prev => ({
      ...prev,
      [name]: name === 'gioiTinh' ? value === 'true' : name === 'maHoKhau' ? (value ? Number(value) : undefined) : value
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
    if (newRowData.maHoKhau === undefined || newRowData.maHoKhau === 0) {
      alert('Vui lòng nhập mã hộ khẩu.');
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
        maHoKhau: newRowData.maHoKhau
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
        maHoKhau: undefined
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
      maHoKhau: undefined
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
        item.maNhanKhau?.toString() || '',
        item.hoTen,
        item.cmnd || '',
        getGioiTinhLabel(item.gioiTinh),
        item.qhVoiChuHo || '',
        item.trangThai || '',
        item.maHoKhau?.toString() || ''
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredData(filtered);
      setHighlightedRowId(filtered[0].maNhanKhau!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].maNhanKhau}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredData([]);
      alert('Không tìm thấy nhân khẩu phù hợp.');
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
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                vaiTro === "3"
                  ? "bg-green-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleAddNewClick}
              disabled={vaiTro === "3"}
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
                {filteredData.map(row => ( // Use filteredData instead of data
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
                            value={editFormData.ngaySinh.split('/').reverse().join('-')} 
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
                            value={editFormData.maHoKhau ?? ''} 
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
                        <td className="px-4 py-3 text-sm text-gray-900">{row.maHoKhau || '-'}</td>
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
                          title={editRowId === row.maNhanKhau ? "Lưu" : "Chỉnh sửa"}
                          disabled={vaiTro === "3"}
                        >
                          {editRowId === row.maNhanKhau ? <FaSave /> : <FaPen />}
                        </button>
                        <button
                          className={`p-2 rounded transition-colors ${
                            vaiTro === "3"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          onClick={() => handleDeleteClick(row.maNhanKhau!)}
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
                        value={newRowData.ngaySinh.split('/').reverse().join('-') || ''} 
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
                        value={newRowData.maHoKhau ?? ''} 
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
              Tổng cộng: {filteredData.length} nhân khẩu {/* Updated to use filteredData.length */}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLNhanKhau;