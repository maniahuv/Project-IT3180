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
  KhoanThu, 
  fetchAllKhoanThu, 
  createKhoanThu, 
  updateKhoanThu, 
  deleteKhoanThu 
} from '../../api/KhoanThuApi';
import { DotThu, fetchAllDotThu } from '../../api/DotThuApi'; // Import DotThu API

interface EditFormData {
  tenKhoanThu: string;
  loaiKhoanThu?: string;
  soTien?: number;
  batBuoc: boolean;
  ghiChu?: string;
  maDotThu?: number; // Use maDotThu directly
}

const loaiKhoanThuOptions = [
  { value: 'HOC_PHI', label: 'Học phí' },
  { value: 'HOAT_DONG', label: 'Hoạt động' },
  { value: 'KHAC', label: 'Khác' }
];

const getLoaiKhoanThuLabel = (loai?: string): string => {
  const option = loaiKhoanThuOptions.find(opt => opt.value === loai);
  return option ? option.label : 'Không xác định';
};

const QLKhoanThu: React.FC = () => {
  const [data, setData] = useState<KhoanThu[]>([]);
  const [dotThuData, setDotThuData] = useState<DotThu[]>([]); // Store DotThu data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    tenKhoanThu: '',
    loaiKhoanThu: 'HOC_PHI',
    soTien: 0,
    batBuoc: false,
    ghiChu: '',
    maDotThu: undefined
  });
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<EditFormData>({
    tenKhoanThu: '',
    loaiKhoanThu: 'HOC_PHI',
    soTien: 0,
    batBuoc: false,
    ghiChu: '',
    maDotThu: undefined
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load KhoanThu
      const khoanThuResponse = await fetchAllKhoanThu();
      console.log('Khoan thu data loaded:', khoanThuResponse.data);
      setData(khoanThuResponse.data);

      // Load DotThu for dropdown and display
      const dotThuResponse = await fetchAllDotThu();
      let dotThuArray: DotThu[] = [];
      if (typeof dotThuResponse.data === 'string') {
        dotThuArray = JSON.parse(dotThuResponse.data);
      } else if (Array.isArray(dotThuResponse.data)) {
        dotThuArray = dotThuResponse.data;
      }
      setDotThuData(dotThuArray);

      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTenDotThu = (maDotThu?: number): string => {
    if (!maDotThu) return '-';
    const dotThu = dotThuData.find(dt => dt.maDotThu === maDotThu);
    return dotThu ? `${dotThu.maDotThu} - ${dotThu.tenDotThu}` : `${maDotThu}`;
  };

  const handleEditClick = async (row: KhoanThu): Promise<void> => {
    if (editRowId === row.maKhoanThu) {
      try {
        const updateData: KhoanThu = {
          maKhoanThu: row.maKhoanThu,
          tenKhoanThu: editFormData.tenKhoanThu,
          loaiKhoanThu: editFormData.loaiKhoanThu,
          soTien: editFormData.soTien,
          batBuoc: editFormData.batBuoc,
          ghiChu: editFormData.ghiChu,
          dotThu: editFormData.maDotThu ? { maDotThu: editFormData.maDotThu } : undefined
        };
        await updateKhoanThu(row.maKhoanThu!, updateData);
        await loadData();
        setEditRowId(null);
        setEditFormData({
          tenKhoanThu: '',
          loaiKhoanThu: 'HOC_PHI',
          soTien: 0,
          batBuoc: false,
          ghiChu: '',
          maDotThu: undefined
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật: ' + (err.response?.data?.message || err.message));
        console.error('Error updating khoan thu:', err);
      }
    } else {
      setEditRowId(row.maKhoanThu!);
      setEditFormData({
        tenKhoanThu: row.tenKhoanThu,
        loaiKhoanThu: row.loaiKhoanThu,
        soTien: row.soTien,
        batBuoc: row.batBuoc,
        ghiChu: row.ghiChu,
        maDotThu: row.maDotThu
      });
    }
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa khoản thu này?')) {
      try {
        await deleteKhoanThu(id);
        await loadData();
        if (editRowId === id) {
          setEditRowId(null);
          setEditFormData({
            tenKhoanThu: '',
            loaiKhoanThu: 'HOC_PHI',
            soTien: 0,
            batBuoc: false,
            ghiChu: '',
            maDotThu: undefined
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting khoan thu:', err);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : name === 'soTien' ? parseFloat(value) || 0 : 
              name === 'maDotThu' ? parseInt(value) || undefined : value 
    }));
  };

  const handleAddNewClick = (): void => {
    setAddingNew(true);
    setNewRowData({
      tenKhoanThu: '',
      loaiKhoanThu: 'HOC_PHI',
      soTien: 0,
      batBuoc: false,
      ghiChu: '',
      maDotThu: undefined
    });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setNewRowData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : name === 'soTien' ? parseFloat(value) || 0 : 
              name === 'maDotThu' ? parseInt(value) || undefined : value 
    }));
  };

  const handleSaveNewRow = async (): Promise<void> => {
    if (!newRowData.tenKhoanThu.trim()) {
      alert('Vui lòng nhập tên khoản thu.');
      return;
    }
    if (!newRowData.soTien || newRowData.soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (!newRowData.maDotThu) {
      alert('Vui lòng chọn đợt thu.');
      return;
    }

    try {
      const newKhoanThu: KhoanThu = {
        tenKhoanThu: newRowData.tenKhoanThu,
        loaiKhoanThu: newRowData.loaiKhoanThu,
        soTien: newRowData.soTien,
        batBuoc: newRowData.batBuoc,
        ghiChu: newRowData.ghiChu,
        dotThu: { maDotThu: newRowData.maDotThu }
      };
      await createKhoanThu(newKhoanThu);
      await loadData();
      setAddingNew(false);
      setNewRowData({
        tenKhoanThu: '',
        loaiKhoanThu: 'HOC_PHI',
        soTien: 0,
        batBuoc: false,
        ghiChu: '',
        maDotThu: undefined
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo khoản thu: ' + (err.response?.data?.message || err.message));
      console.error('Error creating khoan thu:', err);
    }
  };

  const handleCancelNewRow = (): void => {
    setAddingNew(false);
    setNewRowData({
      tenKhoanThu: '',
      loaiKhoanThu: 'HOC_PHI',
      soTien: 0,
      batBuoc: false,
      ghiChu: '',
      maDotThu: undefined
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
        item.maKhoanThu?.toString() || '',
        item.tenKhoanThu,
        getLoaiKhoanThuLabel(item.loaiKhoanThu),
        item.soTien?.toString() || '',
        item.batBuoc ? 'Có' : 'Không',
        item.maDotThu?.toString() || ''
      ];
      return fields[crit]?.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    });
    
    if (found) {
      setHighlightedRowId(found.maKhoanThu!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${found.maKhoanThu}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Không tìm thấy khoản thu phù hợp.');
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
       
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý khoản thu</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={e => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã khoản thu</option>
                <option value="1">Tên khoản thu</option>
                <option value="2">Loại khoản thu</option>
                <option value="3">Số tiền</option>
                <option value="4">Bắt buộc</option>
                <option value="5">Đợt thu</option>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bắt buộc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ghi chú</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đợt thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(row => (
                  <tr
                    key={row.maKhoanThu}
                    id={`row-${row.maKhoanThu}`}
                    className={`hover:bg-gray-50 ${highlightedRowId === row.maKhoanThu ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{row.maKhoanThu}</td>
                    {editRowId === row.maKhoanThu ? (
                      <>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            name="tenKhoanThu" 
                            value={editFormData.tenKhoanThu} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            name="loaiKhoanThu" 
                            value={editFormData.loaiKhoanThu} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          >
                            {loaiKhoanThuOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
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
                            type="checkbox" 
                            name="batBuoc" 
                            checked={editFormData.batBuoc} 
                            onChange={handleEditChange} 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea 
                            name="ghiChu" 
                            value={editFormData.ghiChu || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            name="maDotThu" 
                            value={editFormData.maDotThu || ''} 
                            onChange={handleEditChange} 
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="">Chọn đợt thu</option>
                            {dotThuData.map(dt => (
                              <option key={dt.maDotThu} value={dt.maDotThu}>
                                {dt.maDotThu} - {dt.tenDotThu}
                              </option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.tenKhoanThu}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            row.loaiKhoanThu === 'HOC_PHI' ? 'bg-blue-100 text-blue-800' :
                            row.loaiKhoanThu === 'HOAT_DONG' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getLoaiKhoanThuLabel(row.loaiKhoanThu)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.soTien?.toLocaleString() || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.batBuoc ? 'Có' : 'Không'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.ghiChu || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getTenDotThu(row.maDotThu)}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => handleEditClick(row)}
                          title={editRowId === row.maKhoanThu ? "Lưu" : "Chỉnh sửa"}
                        >
                          {editRowId === row.maKhoanThu ? <FaSave /> : <FaPen />}
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDeleteClick(row.maKhoanThu!)}
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
                      <input 
                        type="text" 
                        name="tenKhoanThu" 
                        placeholder="Tên khoản thu" 
                        value={newRowData.tenKhoanThu} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        name="loaiKhoanThu" 
                        value={newRowData.loaiKhoanThu} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded"
                      >
                        {loaiKhoanThuOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        name="soTien" 
                        placeholder="0" 
                        value={newRowData.soTien || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        name="batBuoc" 
                        checked={newRowData.batBuoc} 
                        onChange={handleNewChange}
                        className="h-4 w-4 rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea 
                        name="ghiChu" 
                        placeholder="Ghi chú" 
                        value={newRowData.ghiChu || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-2 py-1 border rounded" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        name="maDotThu" 
                        value={newRowData.maDotThu || ''} 
                        onChange={handleNewChange} 
                        className="w-full px-4 py-1 border rounded"
                      >
                        <option value="">Chọn đợt thu</option>
                        {dotThuData.map(dt => (
                          <option key={dt.maDotThu} value={dt.maDotThu}>
                            {dt.maDotThu} - {dt.tenDotThu}
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
              Tổng cộng: {data.length} khoản thu
            </div>
          </div>
          </div>
    </MainLayout>
  )
};

export default QLKhoanThu;