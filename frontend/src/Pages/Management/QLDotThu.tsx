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
import { DotThu, fetchAllDotThu, createDotThu, updateDotThu, deleteDotThu } from '../../api/DotThuApi';
import {
  KhoanThu,
  fetchAllKhoanThu,
  createKhoanThu,
  updateKhoanThu,
  deleteKhoanThu,
} from '../../api/KhoanThuApi';

interface EditDotThuFormData {
  tenDotThu: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: string;
}

interface EditKhoanThuFormData {
  tenKhoanThu: string;
  loaiKhoanThu: string;
  soTien: number;
  batBuoc: boolean;
  ghiChu?: string;
  maDotThu: number;
}

const trangThaiOptions = [
  { value: 'DANG_DIEN_RA', label: 'Đang diễn ra', color: 'bg-green-100 text-green-800' },
  { value: 'DA_HOAN_THANH', label: 'Đã hoàn thành', color: 'bg-blue-100 text-blue-800' },
  { value: 'TAM_HOAN', label: 'Tạm hoãn', color: 'bg-yellow-100 text-yellow-800' },
];

const loaiKhoanThuOptions: { value: string; label: string }[] = [
  { value: 'BAO_TRI', label: 'Bảo trì' },
  { value: 'TIEN_ICH', label: 'Tiện ích' },
  { value: 'DICH_VU', label: 'Dịch vụ' },
  { value: 'DIEN_NUOC', label: 'Điện nước'},
  { value: 'GUI_XE', label: 'Gửi xe' },
  { value: 'DONG_GOP', label: 'Đóng góp' },
  { value: 'KHAC', label: 'Khác' },
];


const getTrangThaiLabel = (trangThai?: string): string => {
  const option = trangThaiOptions.find((opt) => opt.value === trangThai);
  return option ? option.label : 'Không xác định';
};

const getTrangThaiColor = (trangThai?: string): string => {
  const option = trangThaiOptions.find((opt) => opt.value === trangThai);
  return option ? option.color : 'bg-gray-100 text-gray-800';
};

const getLoaiKhoanThuLabel = (loai?: string): string => {
  const option = loaiKhoanThuOptions.find((opt) => opt.value === loai);
  return option ? option.label : 'Không xác định';
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
  const [dotThuData, setDotThuData] = useState<DotThu[]>([]);
  const [filteredDotThuData, setFilteredDotThuData] = useState<DotThu[]>([]);
  const [khoanThuData, setKhoanThuData] = useState<KhoanThu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editDotThuId, setEditDotThuId] = useState<number | null>(null);
  const [editDotThuFormData, setEditDotThuFormData] = useState<EditDotThuFormData>({
    tenDotThu: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'DANG_DIEN_RA',
  });
  const [addingNewDotThu, setAddingNewDotThu] = useState<boolean>(false);
  const [newDotThuData, setNewDotThuData] = useState<EditDotThuFormData>({
    tenDotThu: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'DANG_DIEN_RA',
  });
  const [editKhoanThuId, setEditKhoanThuId] = useState<number | null>(null);
  const [editKhoanThuFormData, setEditKhoanThuFormData] = useState<EditKhoanThuFormData>({
    tenKhoanThu: '',
    loaiKhoanThu: 'HOC_PHI',
    soTien: 0,
    batBuoc: false,
    ghiChu: '',
    maDotThu: 0,
  });
  const [addingNewKhoanThu, setAddingNewKhoanThu] = useState<number | null>(null);
  const [newKhoanThuData, setNewKhoanThuData] = useState<EditKhoanThuFormData>({
    tenKhoanThu: '',
    loaiKhoanThu: 'HOC_PHI',
    soTien: 0,
    batBuoc: false,
    ghiChu: '',
    maDotThu: 0,
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredDotThuData(dotThuData);
  }, [dotThuData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const dotThuResponse = await fetchAllDotThu();
      let dotThuArray: DotThu[] = [];
      if (typeof dotThuResponse.data === 'string') {
        dotThuArray = JSON.parse(dotThuResponse.data);
      } else if (Array.isArray(dotThuResponse.data)) {
        dotThuArray = dotThuResponse.data;
      }
      setDotThuData(dotThuArray);
      setFilteredDotThuData(dotThuArray);

      const khoanThuResponse = await fetchAllKhoanThu();
      setKhoanThuData(khoanThuResponse.data);

      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading data:', err);
      setDotThuData([]);
      setFilteredDotThuData([]);
      setKhoanThuData([]);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditDotThuClick = async (row: DotThu): Promise<void> => {
    if (editDotThuId === row.maDotThu) {
      try {
        const updateData: DotThu = {
          maDotThu: row.maDotThu,
          tenDotThu: editDotThuFormData.tenDotThu,
          ngayBatDau: editDotThuFormData.ngayBatDau ? formatDateISO(editDotThuFormData.ngayBatDau) : undefined,
          ngayKetThuc: editDotThuFormData.ngayKetThuc ? formatDateISO(editDotThuFormData.ngayKetThuc) : undefined,
          trangThai: editDotThuFormData.trangThai,
        };
        await updateDotThu(row.maDotThu!, updateData);
        await loadData();
        setEditDotThuId(null);
        setEditDotThuFormData({
          tenDotThu: '',
          ngayBatDau: '',
          ngayKetThuc: '',
          trangThai: 'DANG_DIEN_RA',
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật đợt thu: ' + (err.response?.data?.message || err.message));
        console.error('Error updating dot thu:', err);
      }
    } else {
      setEditDotThuId(row.maDotThu!);
      setEditDotThuFormData({
        tenDotThu: row.tenDotThu,
        ngayBatDau: row.ngayBatDau ? formatDateDisplay(row.ngayBatDau) : '',
        ngayKetThuc: row.ngayKetThuc ? formatDateDisplay(row.ngayKetThuc) : '',
        trangThai: row.trangThai || 'DANG_DIEN_RA',
      });
    }
  };

  const handleDeleteDotThuClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa đợt thu này?')) {
      try {
        await deleteDotThu(id);
        await loadData();
        if (editDotThuId === id) {
          setEditDotThuId(null);
          setEditDotThuFormData({
            tenDotThu: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            trangThai: 'DANG_DIEN_RA',
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa đợt thu: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting dot thu:', err);
      }
    }
  };

  const handleAddNewDotThuClick = (): void => {
    setAddingNewDotThu(true);
    setNewDotThuData({
      tenDotThu: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      trangThai: 'DANG_DIEN_RA',
    });
  };

  const handleEditKhoanThuClick = async (row: KhoanThu): Promise<void> => {
    if (!row.maKhoanThu) return;
    if (editKhoanThuId === row.maKhoanThu) {
      try {
        const updateData: KhoanThu = {
          maKhoanThu: row.maKhoanThu,
          tenKhoanThu: editKhoanThuFormData.tenKhoanThu,
          loaiKhoanThu: editKhoanThuFormData.loaiKhoanThu,
          soTien: editKhoanThuFormData.soTien,
          batBuoc: editKhoanThuFormData.batBuoc,
          ghiChu: editKhoanThuFormData.ghiChu || undefined,
          maDotThu: editKhoanThuFormData.maDotThu,
        };
        await updateKhoanThu(row.maKhoanThu, updateData);
        await loadData();
        setEditKhoanThuId(null);
        setEditKhoanThuFormData({
          tenKhoanThu: '',
          loaiKhoanThu: 'HOC_PHI',
          soTien: 0,
          batBuoc: false,
          ghiChu: '',
          maDotThu: 0,
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật khoản thu: ' + (err.response?.data?.message || err.message));
        console.error('Error updating khoan thu:', err);
      }
    } else {
      setEditKhoanThuId(row.maKhoanThu);
      setEditKhoanThuFormData({
        tenKhoanThu: row.tenKhoanThu,
        loaiKhoanThu: row.loaiKhoanThu || 'HOC_PHI',
        soTien: row.soTien || 0,
        batBuoc: row.batBuoc || false,
        ghiChu: row.ghiChu || '',
        maDotThu: row.maDotThu || 0,
      });
    }
  };

  const handleDeleteKhoanThuClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa khoản thu này?')) {
      try {
        await deleteKhoanThu(id);
        await loadData();
        if (editKhoanThuId === id) {
          setEditKhoanThuId(null);
          setEditKhoanThuFormData({
            tenKhoanThu: '',
            loaiKhoanThu: 'HOC_PHI',
            soTien: 0,
            batBuoc: false,
            ghiChu: '',
            maDotThu: 0,
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa khoản thu: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting khoan thu:', err);
      }
    }
  };

  const handleAddNewKhoanThuClick = (maDotThu: number): void => {
    setAddingNewKhoanThu(maDotThu);
    setNewKhoanThuData({
      tenKhoanThu: '',
      loaiKhoanThu: 'HOC_PHI',
      soTien: 0,
      batBuoc: false,
      ghiChu: '',
      maDotThu: maDotThu,
    });
  };

  const handleDotThuChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isNew: boolean,
  ): void => {
    const { name, value } = e.target;
    const setFormData = isNew ? setNewDotThuData : setEditDotThuFormData;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKhoanThuChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isNew: boolean,
  ): void => {
    const { name, value } = e.target;
    const setFormData = isNew ? setNewKhoanThuData : setEditKhoanThuFormData;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'soTien'
          ? Number(value)
          : name === 'batBuoc'
          ? value === 'true'
          : name === 'maDotThu'
          ? Number(value)
          : value,
    }));
  };

  const handleSaveNewDotThu = async (): Promise<void> => {
    if (!newDotThuData.tenDotThu.trim()) {
      alert('Vui lòng nhập tên đợt thu.');
      return;
    }
    if (!newDotThuData.ngayBatDau?.trim()) {
      alert('Vui lòng nhập ngày bắt đầu.');
      return;
    }
    if (!newDotThuData.trangThai?.trim()) {
      alert('Vui lòng chọn trạng thái.');
      return;
    }

    try {
      const newDotThu: DotThu = {
        tenDotThu: newDotThuData.tenDotThu,
        ngayBatDau: newDotThuData.ngayBatDau ? formatDateISO(newDotThuData.ngayBatDau) : undefined,
        ngayKetThuc: newDotThuData.ngayKetThuc ? formatDateISO(newDotThuData.ngayKetThuc) : undefined,
        trangThai: newDotThuData.trangThai,
      };
      await createDotThu(newDotThu);
      await loadData();
      setAddingNewDotThu(false);
      setNewDotThuData({
        tenDotThu: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        trangThai: 'DANG_DIEN_RA',
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo đợt thu: ' + (err.response?.data?.message || err.message));
      console.error('Error creating dot thu:', err);
    }
  };

  const handleCancelNewDotThu = (): void => {
    setAddingNewDotThu(false);
    setNewDotThuData({
      tenDotThu: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      trangThai: 'DANG_DIEN_RA',
    });
  };

  const handleSaveNewKhoanThu = async (maDotThu: number): Promise<void> => {
    if (!newKhoanThuData.tenKhoanThu.trim()) {
      alert('Vui lòng nhập tên khoản thu.');
      return;
    }
    if (newKhoanThuData.soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (!newKhoanThuData.loaiKhoanThu.trim()) {
      alert('Vui lòng chọn loại khoản thu.');
      return;
    }

    try {
      const newKhoanThu: KhoanThu = {
        tenKhoanThu: newKhoanThuData.tenKhoanThu,
        loaiKhoanThu: newKhoanThuData.loaiKhoanThu,
        soTien: newKhoanThuData.soTien,
        batBuoc: newKhoanThuData.batBuoc,
        ghiChu: newKhoanThuData.ghiChu || undefined,
        maDotThu: maDotThu,
      };
      await createKhoanThu(newKhoanThu);
      await loadData();
      setAddingNewKhoanThu(null);
      setNewKhoanThuData({
        tenKhoanThu: '',
        loaiKhoanThu: 'HOC_PHI',
        soTien: 0,
        batBuoc: false,
        ghiChu: '',
        maDotThu: 0,
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo khoản thu: ' + (err.response?.data?.message || err.message));
      console.error('Error creating khoan thu:', err);
    }
  };

  const handleCancelNewKhoanThu = (): void => {
    setAddingNewKhoanThu(null);
    setNewKhoanThuData({
      tenKhoanThu: '',
      loaiKhoanThu: 'HOC_PHI',
      soTien: 0,
      batBuoc: false,
      ghiChu: '',
      maDotThu: 0,
    });
  };

  const handleRowClick = (maDotThu: number): void => {
    if (editDotThuId === null && editKhoanThuId === null) {
      setExpandedRowId((prev) => (prev === maDotThu ? null : maDotThu));
    }
  };

  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredDotThuData(dotThuData);
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = dotThuData.filter((item) => {
      const fields = [
        item.maDotThu?.toString() || '',
        item.tenDotThu,
        formatDateDisplay(item.ngayBatDau),
        formatDateDisplay(item.ngayKetThuc),
        getTrangThaiLabel(item.trangThai),
      ];
      return fields[crit]?.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredDotThuData(filtered);
      setHighlightedRowId(filtered[0].maDotThu!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].maDotThu}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredDotThuData([]);
      alert('Không tìm thấy đợt thu phù hợp.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredDotThuData(dotThuData);
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

  const getSoKhoanThu = (maDotThu?: number): string => {
    return khoanThuData.filter((kt) => kt.maDotThu === maDotThu).length.toString();
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đợt Thu và Khoản Thu</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
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
              onClick={handleAddNewDotThuClick}
            >
              <FaPlus />
              <span>Thêm đợt thu</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
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
                {filteredDotThuData.map((row) => (
                  <React.Fragment key={row.maDotThu}>
                    <tr
                      id={`row-${row.maDotThu}`}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        highlightedRowId === row.maDotThu ? 'bg-yellow-100' : ''
                      }`}
                      onClick={() => handleRowClick(row.maDotThu!)}
                    >
                      <td className="px-4 py-3">
                        <span>{expandedRowId === row.maDotThu ? <FaChevronUp /> : <FaChevronDown />}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.maDotThu}</td>
                      {editDotThuId === row.maDotThu ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              name="tenDotThu"
                              value={editDotThuFormData.tenDotThu}
                              onChange={(e) => handleDotThuChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              name="ngayBatDau"
                              value={editDotThuFormData.ngayBatDau || ''}
                              onChange={(e) => handleDotThuChange(e, false)}
                              placeholder="DD/MM/YYYY"
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              name="ngayKetThuc"
                              value={editDotThuFormData.ngayKetThuc || ''}
                              onChange={(e) => handleDotThuChange(e, false)}
                              placeholder="DD/MM/YYYY"
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              name="trangThai"
                              value={editDotThuFormData.trangThai || ''}
                              onChange={(e) => handleDotThuChange(e, false)}
                              className="w-full px-2 py-1 border rounded"
                            >
                              {trangThaiOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getSoKhoanThu(row.maDotThu)}</td>
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
                          <td className="px-4 py-3 text-sm text-gray-900">{getSoKhoanThu(row.maDotThu)}</td>
                        </>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDotThuClick(row);
                            }}
                            title={editDotThuId === row.maDotThu ? 'Lưu' : 'Chỉnh sửa'}
                          >
                            {editDotThuId === row.maDotThu ? <FaSave /> : <FaPen />}
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDotThuClick(row.maDotThu!);
                            }}
                            title="Xóa"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRowId === row.maDotThu && (
                      <tr>
                        <td colSpan={8} className="px-4 py-3 bg-gray-100">
                          <div className="pl-8">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Danh sách khoản thu</h3>
                            <table className="w-full border-t border-gray-200">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mã khoản thu</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tên khoản thu</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Loại khoản thu</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Số tiền</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bắt buộc</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ghi chú</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hành động</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {khoanThuData
                                  .filter((kt) => kt.maDotThu === row.maDotThu)
                                  .map((kt) => (
                                    <tr key={kt.maKhoanThu} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 text-sm text-gray-900">{kt.maKhoanThu}</td>
                                      {editKhoanThuId === kt.maKhoanThu ? (
                                        <>
                                          <td className="px-4 py-2">
                                            <input
                                              type="text"
                                              name="tenKhoanThu"
                                              value={editKhoanThuFormData.tenKhoanThu}
                                              onChange={(e) => handleKhoanThuChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-2">
                                            <select
                                              name="loaiKhoanThu"
                                              value={editKhoanThuFormData.loaiKhoanThu}
                                              onChange={(e) => handleKhoanThuChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            >
                                              {loaiKhoanThuOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                  {option.label}
                                                </option>
                                              ))}
                                            </select>
                                          </td>
                                          <td className="px-4 py-2">
                                            <input
                                              type="number"
                                              name="soTien"
                                              value={editKhoanThuFormData.soTien}
                                              onChange={(e) => handleKhoanThuChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-2">
                                            <select
                                              name="batBuoc"
                                              value={editKhoanThuFormData.batBuoc.toString()}
                                              onChange={(e) => handleKhoanThuChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            >
                                              <option value="true">Có</option>
                                              <option value="false">Không</option>
                                            </select>
                                          </td>
                                          <td className="px-4 py-2">
                                            <input
                                              type="text"
                                              name="ghiChu"
                                              value={editKhoanThuFormData.ghiChu || ''}
                                              onChange={(e) => handleKhoanThuChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          <td className="px-4 py-2 text-sm text-gray-900">{kt.tenKhoanThu}</td>
                                          <td className="px-4 py-2">
                                            <span
                                              className={`px-2 py-1 text-xs rounded-full ${
                                                kt.loaiKhoanThu === 'HOC_PHI'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : kt.loaiKhoanThu === 'HOAT_DONG'
                                                  ? 'bg-purple-100 text-purple-800'
                                                  : 'bg-gray-100 text-gray-800'
                                              }`}
                                            >
                                              {getLoaiKhoanThuLabel(kt.loaiKhoanThu)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{kt.soTien?.toLocaleString() || '-'}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{kt.batBuoc ? 'Có' : 'Không'}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{kt.ghiChu || '-'}</td>
                                        </>
                                      )}
                                      <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                          <button
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditKhoanThuClick(kt);
                                            }}
                                            title={editKhoanThuId === kt.maKhoanThu ? 'Lưu' : 'Chỉnh sửa'}
                                            disabled={!kt.maKhoanThu}
                                          >
                                            {editKhoanThuId === kt.maKhoanThu ? <FaSave /> : <FaPen />}
                                          </button>
                                          <button
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              kt.maKhoanThu && handleDeleteKhoanThuClick(kt.maKhoanThu);
                                            }}
                                            title="Xóa"
                                            disabled={!kt.maKhoanThu}
                                          >
                                            <FaTrashAlt />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                {addingNewKhoanThu === row.maDotThu && (
                                  <tr className="bg-blue-50">
                                    <td className="px-4 py-2 text-sm text-gray-900">-</td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        name="tenKhoanThu"
                                        placeholder="Tên khoản thu"
                                        value={newKhoanThuData.tenKhoanThu}
                                        onChange={(e) => handleKhoanThuChange(e, true)}
                                        className="w-full px-2 py-1 border rounded"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <select
                                        name="loaiKhoanThu"
                                        value={newKhoanThuData.loaiKhoanThu}
                                        onChange={(e) => handleKhoanThuChange(e, true)}
                                        className="w-full px-2 py-1 border rounded"
                                      >
                                        {loaiKhoanThuOptions.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="number"
                                        name="soTien"
                                        placeholder="Số tiền"
                                        value={newKhoanThuData.soTien}
                                        onChange={(e) => handleKhoanThuChange(e, true)}
                                        className="w-full px-2 py-1 border rounded"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <select
                                        name="batBuoc"
                                        value={newKhoanThuData.batBuoc.toString()}
                                        onChange={(e) => handleKhoanThuChange(e, true)}
                                        className="w-full px-2 py-1 border rounded"
                                      >
                                        <option value="true">Có</option>
                                        <option value="false">Không</option>
                                      </select>
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        name="ghiChu"
                                        placeholder="Ghi chú"
                                        value={newKhoanThuData.ghiChu || ''}
                                        onChange={(e) => handleKhoanThuChange(e, true)}
                                        className="w-full px-2 py-1 border rounded"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <div className="flex space-x-2">
                                        <button
                                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                                          onClick={() => handleSaveNewKhoanThu(row.maDotThu!)}
                                          title="Lưu"
                                        >
                                          <FaSave />
                                        </button>
                                        <button
                                          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                          onClick={handleCancelNewKhoanThu}
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
                            <button
                              className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                              onClick={() => handleAddNewKhoanThuClick(row.maDotThu!)}
                            >
                              <FaPlus />
                              <span>Thêm khoản thu</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {addingNewDotThu && (
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm text-gray-900">-</td>
                    <td className="px-4 py-3 text-sm text-gray-900">-</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name="tenDotThu"
                        placeholder="Tên đợt thu"
                        value={newDotThuData.tenDotThu}
                        onChange={(e) => handleDotThuChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name="ngayBatDau"
                        placeholder="DD/MM/YYYY"
                        value={newDotThuData.ngayBatDau || ''}
                        onChange={(e) => handleDotThuChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name="ngayKetThuc"
                        placeholder="DD/MM/YYYY"
                        value={newDotThuData.ngayKetThuc || ''}
                        onChange={(e) => handleDotThuChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        name="trangThai"
                        value={newDotThuData.trangThai || ''}
                        onChange={(e) => handleDotThuChange(e, true)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        {trangThaiOptions.map((option) => (
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
                          onClick={handleSaveNewDotThu}
                          title="Lưu"
                        >
                          <FaSave />
                        </button>
                        <button
                          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          onClick={handleCancelNewDotThu}
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
            <div className="text-sm text-gray-700">Tổng cộng: {filteredDotThuData.length} đợt thu</div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default React.memo(QLDotThu);