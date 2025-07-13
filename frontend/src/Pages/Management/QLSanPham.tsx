
import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaPlus,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import MainLayout from '../../Layout/MainLayout';
import { SanPham, fetchAllSanPham, createSanPham, updateSanPham, deleteSanPham, tinhLoiNhuan } from '../../api/SanPhamAPI';

interface EditSanPhamFormData {
  ten: string;
  ngayNhapHang?: string;
  donGiaGoc: number;
  giaBan: number;
  tonKho: number;
  daBan: number;
  moTa?: string;
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

const QLSanPham: React.FC = () => {
  const [sanPhamData, setSanPhamData] = useState<SanPham[]>([]);
  const [filteredSanPhamData, setFilteredSanPhamData] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editSanPhamId, setEditSanPhamId] = useState<string | null>(null);
  const [editSanPhamFormData, setEditSanPhamFormData] = useState<EditSanPhamFormData>({
    ten: '',
    ngayNhapHang: '',
    donGiaGoc: 0,
    giaBan: 0,
    tonKho: 0,
    daBan: 0,
    moTa: '',
  });
  const [addingNewSanPham, setAddingNewSanPham] = useState<boolean>(false);
  const [newSanPhamData, setNewSanPhamData] = useState<EditSanPhamFormData>({
    ten: '',
    ngayNhapHang: '',
    donGiaGoc: 0,
    giaBan: 0,
    tonKho: 0,
    daBan: 0,
    moTa: '',
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [loiNhuan, setLoiNhuan] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredSanPhamData(sanPhamData);
  }, [sanPhamData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const sanPhamResponse = await fetchAllSanPham();
      let sanPhamArray: SanPham[] = [];
      if (typeof sanPhamResponse.data === 'string') {
        sanPhamArray = JSON.parse(sanPhamResponse.data);
      } else if (Array.isArray(sanPhamResponse.data)) {
        sanPhamArray = sanPhamResponse.data;
      }
      setSanPhamData(sanPhamArray);
      setFilteredSanPhamData(sanPhamArray);

      // Tính lợi nhuận cho từng sản phẩm
      const loiNhuanData: { [key: string]: number } = {};
      for (const sp of sanPhamArray) {
        if (sp.idSp) {
          const response = await tinhLoiNhuan(sp.idSp);
          loiNhuanData[sp.idSp] = response.data;
        }
      }
      setLoiNhuan(loiNhuanData);

      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading data:', err);
      setSanPhamData([]);
      setFilteredSanPhamData([]);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSanPhamClick = async (row: SanPham): Promise<void> => {
    if (editSanPhamId === row.idSp) {
      try {
        const updateData: SanPham = {
          idSp: row.idSp,
          ten: editSanPhamFormData.ten,
          ngayNhapHang: editSanPhamFormData.ngayNhapHang ? formatDateISO(editSanPhamFormData.ngayNhapHang) : undefined,
          donGiaGoc: editSanPhamFormData.donGiaGoc,
          giaBan: editSanPhamFormData.giaBan,
          tonKho: editSanPhamFormData.tonKho,
          daBan: editSanPhamFormData.daBan,
          moTa: editSanPhamFormData.moTa || undefined,
        };
        await updateSanPham(row.idSp!, updateData);
        await loadData();
        setEditSanPhamId(null);
        setEditSanPhamFormData({
          ten: '',
          ngayNhapHang: '',
          donGiaGoc: 0,
          giaBan: 0,
          tonKho: 0,
          daBan: 0,
          moTa: '',
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật sản phẩm: ' + (err.response?.data?.message || err.message));
        console.error('Error updating san pham:', err);
      }
    } else {
      setEditSanPhamId(row.idSp!);
      setEditSanPhamFormData({
        ten: row.ten,
        ngayNhapHang: row.ngayNhapHang ? formatDateDisplay(row.ngayNhapHang) : '',
        donGiaGoc: row.donGiaGoc,
        giaBan: row.giaBan,
        tonKho: row.tonKho,
        daBan: row.daBan,
        moTa: row.moTa || '',
      });
    }
  };

  const handleDeleteSanPhamClick = async (id: string): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteSanPham(id);
        await loadData();
        if (editSanPhamId === id) {
          setEditSanPhamId(null);
          setEditSanPhamFormData({
            ten: '',
            ngayNhapHang: '',
            donGiaGoc: 0,
            giaBan: 0,
            tonKho: 0,
            daBan: 0,
            moTa: '',
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa sản phẩm: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting san pham:', err);
      }
    }
  };

  const handleAddNewSanPhamClick = (): void => {
    setAddingNewSanPham(true);
    setNewSanPhamData({
      ten: '',
      ngayNhapHang: '',
      donGiaGoc: 0,
      giaBan: 0,
      tonKho: 0,
      daBan: 0,
      moTa: '',
    });
  };

  const handleSanPhamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isNew: boolean,
  ): void => {
    const { name, value } = e.target;
    const setFormData = isNew ? setNewSanPhamData : setEditSanPhamFormData;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'donGiaGoc' || name === 'giaBan' || name === 'tonKho' || name === 'daBan'
          ? Number(value)
          : value,
    }));
  };

  const handleSaveNewSanPham = async (): Promise<void> => {
    if (!newSanPhamData.ten.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!newSanPhamData.ngayNhapHang?.trim()) {
      alert('Vui lòng nhập ngày nhập hàng.');
      return;
    }
    if (newSanPhamData.donGiaGoc <= 0) {
      alert('Vui lòng nhập đơn giá gốc hợp lệ.');
      return;
    }
    if (newSanPhamData.giaBan <= 0) {
      alert('Vui lòng nhập giá bán hợp lệ.');
      return;
    }
    if (newSanPhamData.tonKho < 0) {
      alert('Tồn kho không được nhỏ hơn 0.');
      return;
    }
    if (newSanPhamData.daBan < 0) {
      alert('Số lượng đã bán không được nhỏ hơn 0.');
      return;
    }

    try {
      const newSanPham: SanPham = {
        ten: newSanPhamData.ten,
        ngayNhapHang: newSanPhamData.ngayNhapHang ? formatDateISO(newSanPhamData.ngayNhapHang) : undefined,
        donGiaGoc: newSanPhamData.donGiaGoc,
        giaBan: newSanPhamData.giaBan,
        tonKho: newSanPhamData.tonKho,
        daBan: newSanPhamData.daBan,
        moTa: newSanPhamData.moTa || undefined,
      };
      await createSanPham(newSanPham);
      await loadData();
      setAddingNewSanPham(false);
      setNewSanPhamData({
        ten: '',
        ngayNhapHang: '',
        donGiaGoc: 0,
        giaBan: 0,
        tonKho: 0,
        daBan: 0,
        moTa: '',
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo sản phẩm: ' + (err.response?.data?.message || err.message));
      console.error('Error creating san pham:', err);
    }
  };

  const handleCancelNewSanPham = (): void => {
    setAddingNewSanPham(false);
    setNewSanPhamData({
      ten: '',
      ngayNhapHang: '',
      donGiaGoc: 0,
      giaBan: 0,
      tonKho: 0,
      daBan: 0,
      moTa: '',
    });
  };

  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredSanPhamData(sanPhamData);
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = sanPhamData.filter((item) => {
      const fields = [
        item.idSp || '',
        item.ten,
        formatDateDisplay(item.ngayNhapHang),
        item.donGiaGoc.toString(),
        item.giaBan.toString(),
        item.tonKho.toString(),
        item.daBan.toString(),
        item.moTa || '',
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredSanPhamData(filtered);
      setHighlightedRowId(filtered[0].idSp!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].idSp}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredSanPhamData([]);
      alert('Không tìm thấy sản phẩm phù hợp.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredSanPhamData(sanPhamData);
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
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Sản Phẩm</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
              >
                <option value="0">Mã sản phẩm</option>
                <option value="1">Tên sản phẩm</option>
                <option value="2">Ngày nhập hàng</option>
                <option value="3">Đơn giá gốc</option>
                <option value="4">Giá bán</option>
                <option value="5">Tồn kho</option>
                <option value="6">Đã bán</option>
                <option value="7">Mô tả</option>
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
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              onClick={handleAddNewSanPhamClick}
            >
              <FaPlus />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã sản phẩm</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày nhập hàng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đơn giá gốc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Giá bán</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tồn kho</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đã bán</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lợi nhuận</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSanPhamData.map((row) => (
                  <React.Fragment key={row.idSp}>
                    <tr
                      id={`row-${row.idSp}`}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        highlightedRowId === row.idSp ? 'bg-yellow-100' : ''
                      }`}
                      onClick={() => {
                        if (!row.idSp) return;
                        setExpandedRowId(prev =>
                          prev === row.idSp! ? null : row.idSp!
                        );
                      }}
                    >
                      <td className="px-4 py-3">
                        <span>{expandedRowId === row.idSp ? <FaChevronUp /> : <FaChevronDown />}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.idSp}</td>
                      {editSanPhamId === row.idSp ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              name="ten"
                              value={editSanPhamFormData.ten}
                              onChange={(e) => handleSanPhamChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              name="ngayNhapHang"
                              value={editSanPhamFormData.ngayNhapHang || ''}
                              onChange={(e) => handleSanPhamChange(e, false)}
                              placeholder="DD/MM/YYYY"
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              name="donGiaGoc"
                              value={editSanPhamFormData.donGiaGoc}
                              onChange={(e) => handleSanPhamChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              name="giaBan"
                              value={editSanPhamFormData.giaBan}
                              onChange={(e) => handleSanPhamChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              name="tonKho"
                              value={editSanPhamFormData.tonKho}
                              onChange={(e) => handleSanPhamChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              name="daBan"
                              value={editSanPhamFormData.daBan}
                              onChange={(e) => handleSanPhamChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{loiNhuan[row.idSp!]?.toLocaleString() || '-'}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.ten}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatDateDisplay(row.ngayNhapHang)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.donGiaGoc.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.giaBan.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.tonKho}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.daBan}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{loiNhuan[row.idSp!]?.toLocaleString() || '-'}</td>
                        </>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSanPhamClick(row);
                            }}
                            title={editSanPhamId === row.idSp ? 'Lưu' : 'Chỉnh sửa'}
                          >
                            {editSanPhamId === row.idSp ? <FaSave /> : <FaPen />}
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              row.idSp && handleDeleteSanPhamClick(row.idSp);
                            }}
                            title="Xóa"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRowId === row.idSp && (
                      <tr>
                        <td colSpan={10} className="px-4 py-3 bg-gray-100">
                          <div className="pl-8">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Chi tiết sản phẩm</h3>
                            <p><strong>Mô tả:</strong> {row.moTa || 'Không có'}</p>
                            <p><strong>Lợi nhuận:</strong> {loiNhuan[row.idSp!]?.toLocaleString() || '-'} VNĐ</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {addingNewSanPham && (
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm text-gray-900">-</td>
                    <td className="px-4 py-3 text-sm text-gray-900">-</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name="ten"
                        placeholder="Tên sản phẩm"
                        value={newSanPhamData.ten}
                        onChange={(e) => handleSanPhamChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name="ngayNhapHang"
                        placeholder="DD/MM/YYYY"
                        value={newSanPhamData.ngayNhapHang || ''}
                        onChange={(e) => handleSanPhamChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="donGiaGoc"
                        placeholder="Đơn giá gốc"
                        value={newSanPhamData.donGiaGoc}
                        onChange={(e) => handleSanPhamChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="giaBan"
                        placeholder="Giá bán"
                        value={newSanPhamData.giaBan}
                        onChange={(e) => handleSanPhamChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="tonKho"
                        placeholder="Tồn kho"
                        value={newSanPhamData.tonKho}
                        onChange={(e) => handleSanPhamChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="daBan"
                        placeholder="Đã bán"
                        value={newSanPhamData.daBan}
                        onChange={(e) => handleSanPhamChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">-</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={handleSaveNewSanPham}
                          title="Lưu"
                        >
                          <FaSave />
                        </button>
                        <button
                          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          onClick={handleCancelNewSanPham}
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
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
            </div>
            <div className="text-sm text-gray-700">Tổng cộng: {filteredSanPhamData.length} sản phẩm</div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default React.memo(QLSanPham);
