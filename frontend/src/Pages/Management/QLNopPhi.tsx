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
import {
  KhoanThu,
  fetchAllKhoanThu,
} from '../../api/KhoanThuApi';
import { DotThu, fetchAllDotThu } from '../../api/DotThuApi';
import {
  NopPhi,
  fetchAllNopPhi,
  createNopPhi,
  updateNopPhi,
  deleteNopPhi,
} from '../../api/NopPhiApi';

// Define interfaces for type safety
interface KhoanThu {
  maKhoanThu?: number;
  tenKhoanThu?: string;
  loaiKhoanThu?: 'HOC_PHI' | 'HOAT_DONG' | 'DICH_VU' | 'DONG_GOP' | 'KHAC';
  soTien?: number;
  batBuoc?: boolean;
  ghiChu?: string;
  maDotThu?: number;
}

interface DotThu {
  maDotThu?: number;
  tenDotThu?: string;
}

interface NopPhi {
  id?: number;
  ngayThu?: string;
  soTien?: number;
  nguoiNop?: string;
  idNguoiThu?: number;
  maHoKhau?: number;
  maKhoanThu?: number;
  nguoiThu?: { id: number };
  hoKhau?: { maHoKhau: number };
  khoanThu?: { maKhoanThu: number };
}

interface EditNopPhiFormData {
  ngayThu: string;
  soTien: number;
  nguoiNop: string;
  nguoiThuId: number;
  hoKhauMaHoKhau: number;
  khoanThuMaKhoanThu: number;
}

// Define loaiKhoanThuOptions with explicit types
const loaiKhoanThuOptions: { value: string; label: string }[] = [
  { value: 'HOC_PHI', label: 'Học phí' },
  { value: 'HOAT_DONG', label: 'Hoạt động' },
  { value: 'DICH_VU', label: 'Dịch vụ' },
  { value: 'DONG_GOP', label: 'Đóng góp' },
  { value: 'KHAC', label: 'Khác' },
];

// Normalize loaiKhoanThu and handle edge cases
const getLoaiKhoanThuLabel = (loai?: string): string => {
  if (!loai) return 'Khác'; // Handle null or undefined
  const normalizedLoai = loai.toUpperCase(); // Normalize to uppercase
  const option = loaiKhoanThuOptions.find((opt) => opt.value === normalizedLoai);
  return option ? option.label : 'Khác'; // Default to 'Khác' if not found
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

const QLNopPhi: React.FC = () => {
  const [khoanThuData, setKhoanThuData] = useState<KhoanThu[]>([]);
  const [filteredKhoanThuData, setFilteredKhoanThuData] = useState<KhoanThu[]>([]);
  const [nopPhiData, setNopPhiData] = useState<NopPhi[]>([]);
  const [filteredNopPhiData, setFilteredNopPhiData] = useState<{ [key: number]: NopPhi[] }>({});
  const [dotThuData, setDotThuData] = useState<DotThu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editNopPhiId, setEditNopPhiId] = useState<number | null>(null);
  const [editNopPhiFormData, setEditNopPhiFormData] = useState<EditNopPhiFormData>({
    ngayThu: '',
    soTien: 0,
    nguoiNop: '',
    nguoiThuId: 0,
    hoKhauMaHoKhau: 0,
    khoanThuMaKhoanThu: 0,
  });
  const [addingNewNopPhi, setAddingNewNopPhi] = useState<number | null>(null);
  const [newNopPhiData, setNewNopPhiData] = useState<EditNopPhiFormData>({
    ngayThu: '',
    soTien: 0,
    nguoiNop: '',
    nguoiThuId: 0,
    hoKhauMaHoKhau: 0,
    khoanThuMaKhoanThu: 0,
  });
  const [searchCriteria, setSearchCriteria] = useState<string>('0');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [nopPhiSearchCriteria, setNopPhiSearchCriteria] = useState<{ [key: number]: string }>({});
  const [nopPhiSearchKeyword, setNopPhiSearchKeyword] = useState<{ [key: number]: string }>({});
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredKhoanThuData(khoanThuData);
    const initialFilteredNopPhi: { [key: number]: NopPhi[] } = {};
    khoanThuData.forEach((kt) => {
      if (kt.maKhoanThu) {
        initialFilteredNopPhi[kt.maKhoanThu] = nopPhiData.filter((np) => np.maKhoanThu === kt.maKhoanThu);
      }
    });
    setFilteredNopPhiData(initialFilteredNopPhi);
  }, [khoanThuData, nopPhiData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const khoanThuResponse = await fetchAllKhoanThu();
      console.log('Khoan Thu Response:', khoanThuResponse.data);
      
      // Ensure khoanThuData is an array and log loaiKhoanThu values
      const khoanThuArray = Array.isArray(khoanThuResponse.data)
        ? khoanThuResponse.data
        : [];
      console.log(
        'loaiKhoanThu Values:',
        khoanThuArray.map((kt: KhoanThu) => kt.loaiKhoanThu)
      );
      
      setKhoanThuData(khoanThuArray);
      setFilteredKhoanThuData(khoanThuArray);

      const dotThuResponse = await fetchAllDotThu();
      let dotThuArray: DotThu[] = [];
      if (typeof dotThuResponse.data === 'string') {
        dotThuArray = JSON.parse(dotThuResponse.data);
      } else if (Array.isArray(dotThuResponse.data)) {
        dotThuArray = dotThuResponse.data;
      }
      setDotThuData(dotThuArray);

      const nopPhiResponse = await fetchAllNopPhi();
      setNopPhiData(nopPhiResponse.data);
      setError('');
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      console.error('Error loading data:', err);
      setKhoanThuData([]);
      setFilteredKhoanThuData([]);
      setNopPhiData([]);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTenDotThu = (maDotThu?: number): string => {
    if (!maDotThu) return '-';
    const dotThu = dotThuData.find((dt) => dt.maDotThu === maDotThu);
    return dotThu ? `${dotThu.maDotThu} - ${dotThu.tenDotThu}` : `${maDotThu}`;
  };

  const getNopPhiStats = (maKhoanThu: number) => {
    const relatedNopPhi = nopPhiData.filter((np) => np.maKhoanThu === maKhoanThu);
    const soNguoiDaNop = relatedNopPhi.length;
    const soTienDaThu = relatedNopPhi.reduce((sum, np) => sum + (np.soTien || 0), 0);
    return { soNguoiDaNop, soTienDaThu };
  };

  const handleEditNopPhiClick = async (row: NopPhi): Promise<void> => {
    if (!row.id) return;
    if (editNopPhiId === row.id) {
      try {
        const updateData: NopPhi = {
          id: row.id,
          ngayThu: editNopPhiFormData.ngayThu ? formatDateISO(editNopPhiFormData.ngayThu) : undefined,
          soTien: editNopPhiFormData.soTien,
          nguoiNop: editNopPhiFormData.nguoiNop || undefined,
          nguoiThu: { id: editNopPhiFormData.nguoiThuId },
          hoKhau: { maHoKhau: editNopPhiFormData.hoKhauMaHoKhau },
          khoanThu: { maKhoanThu: editNopPhiFormData.khoanThuMaKhoanThu },
        };
        await updateNopPhi(row.id, updateData);
        await loadData();
        setEditNopPhiId(null);
        setEditNopPhiFormData({
          ngayThu: '',
          soTien: 0,
          nguoiNop: '',
          nguoiThuId: 0,
          hoKhauMaHoKhau: 0,
          khoanThuMaKhoanThu: 0,
        });
      } catch (err: any) {
        alert('Có lỗi xảy ra khi cập nhật nộp phí: ' + (err.response?.data?.message || err.message));
        console.error('Error updating nop phi:', err);
      }
    } else {
      setEditNopPhiId(row.id);
      setEditNopPhiFormData({
        ngayThu: row.ngayThu ? formatDateDisplay(row.ngayThu) : '',
        soTien: row.soTien || 0,
        nguoiNop: row.nguoiNop || '',
        nguoiThuId: row.idNguoiThu || 0,
        hoKhauMaHoKhau: row.maHoKhau || 0,
        khoanThuMaKhoanThu: row.maKhoanThu || 0,
      });
    }
  };

  const handleDeleteNopPhiClick = async (id: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi nộp phí này?')) {
      try {
        await deleteNopPhi(id);
        await loadData();
        if (editNopPhiId === id) {
          setEditNopPhiId(null);
          setEditNopPhiFormData({
            ngayThu: '',
            soTien: 0,
            nguoiNop: '',
            nguoiThuId: 0,
            hoKhauMaHoKhau: 0,
            khoanThuMaKhoanThu: 0,
          });
        }
      } catch (err: any) {
        alert('Có lỗi xảy ra khi xóa nộp phí: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting nop phi:', err);
      }
    }
  };

  const handleAddNewNopPhiClick = (maKhoanThu: number): void => {
    setAddingNewNopPhi(maKhoanThu);
    setNewNopPhiData({
      ngayThu: '',
      soTien: 0,
      nguoiNop: '',
      nguoiThuId: 0,
      hoKhauMaHoKhau: 0,
      khoanThuMaKhoanThu: maKhoanThu,
    });
  };

  const handleNopPhiChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isNew: boolean,
  ): void => {
    const { name, value } = e.target;
    const setFormData = isNew ? setNewNopPhiData : setEditNopPhiFormData;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'soTien' || name === 'nguoiThuId' || name === 'hoKhauMaHoKhau' || name === 'khoanThuMaKhoanThu'
          ? Number(value)
          : value,
    }));
  };

  const handleSaveNewNopPhi = async (maKhoanThu: number | null): Promise<void> => {
    if (!newNopPhiData.ngayThu.trim()) {
      alert('Vui lòng nhập ngày thu.');
      return;
    }
    if (newNopPhiData.soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (!newNopPhiData.nguoiNop.trim()) {
      alert('Vui lòng nhập người nộp.');
      return;
    }
    if (newNopPhiData.nguoiThuId <= 0) {
      alert('Vui lòng nhập mã người thu hợp lệ.');
      return;
    }
    if (newNopPhiData.hoKhauMaHoKhau <= 0) {
      alert('Vui lòng nhập mã hộ khẩu hợp lệ.');
      return;
    }

    try {
      const newNopPhi: NopPhi = {
        ngayThu: formatDateISO(newNopPhiData.ngayThu),
        soTien: newNopPhiData.soTien,
        nguoiNop: newNopPhiData.nguoiNop,
        idNguoiThu: newNopPhiData.nguoiThuId,
        maHoKhau: newNopPhiData.hoKhauMaHoKhau,
        maKhoanThu: newNopPhiData.khoanThuMaKhoanThu,
      };
      await createNopPhi(newNopPhi);
      await loadData();
      setAddingNewNopPhi(null);
      setNewNopPhiData({
        ngayThu: '',
        soTien: 0,
        nguoiNop: '',
        nguoiThuId: 0,
        hoKhauMaHoKhau: 0,
        khoanThuMaKhoanThu: 0,
      });
    } catch (err: any) {
      alert('Có lỗi xảy ra khi tạo bản ghi nộp phí: ' + (err.response?.data?.message || err.message));
      console.error('Error creating nop phi:', err);
    }
  };

  const handleCancelNewNopPhi = (): void => {
    setAddingNewNopPhi(null);
    setNewNopPhiData({
      ngayThu: '',
      soTien: 0,
      nguoiNop: '',
      nguoiThuId: 0,
      hoKhauMaHoKhau: 0,
      khoanThuMaKhoanThu: 0,
    });
  };

  const handleRowClick = (maKhoanThu: number): void => {
    if (editNopPhiId === null) {
      setExpandedRowId((prev) => (prev === maKhoanThu ? null : maKhoanThu));
    }
  };

  const handleSearch = (): void => {
    if (!searchKeyword.trim()) {
      setFilteredKhoanThuData(khoanThuData);
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    const crit = parseInt(searchCriteria, 10);
    const filtered = khoanThuData.filter((item) => {
      const fields = [
        item.maKhoanThu?.toString() || '',
        item.tenKhoanThu || '',
        getLoaiKhoanThuLabel(item.loaiKhoanThu),
        item.soTien?.toString() || '',
        item.batBuoc ? 'Có' : 'Không',
        getTenDotThu(item.maDotThu),
      ];
      return fields[crit]?.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredKhoanThuData(filtered);
      setHighlightedRowId(filtered[0].maKhoanThu!);
      setTimeout(() => setHighlightedRowId(null), 3000);
      document.getElementById(`row-${filtered[0].maKhoanThu}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setFilteredKhoanThuData([]);
      alert('Không tìm thấy khoản thu phù hợp.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredKhoanThuData(khoanThuData);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNopPhiSearch = (maKhoanThu: number): void => {
    const keyword = nopPhiSearchKeyword[maKhoanThu] || '';
    const crit = parseInt(nopPhiSearchCriteria[maKhoanThu] || '0', 10);
    if (!keyword.trim()) {
      setFilteredNopPhiData((prev) => ({
        ...prev,
        [maKhoanThu]: nopPhiData.filter((np) => np.maKhoanThu === maKhoanThu),
      }));
      alert('Vui lòng nhập từ khóa tìm kiếm nộp phí.');
      return;
    }

    const filtered = nopPhiData
      .filter((np) => np.maKhoanThu === maKhoanThu)
      .filter((np) => {
        const fields = [
          np.id?.toString() || '',
          formatDateDisplay(np.ngayThu),
          np.soTien?.toString() || '',
          np.nguoiNop || '',
          np.idNguoiThu?.toString() || '',
          np.maHoKhau?.toString() || '',
        ];
        return fields[crit]?.toString().toLowerCase().includes(keyword.toLowerCase());
      });

    if (filtered.length > 0) {
      setFilteredNopPhiData((prev) => ({ ...prev, [maKhoanThu]: filtered }));
    } else {
      setFilteredNopPhiData((prev) => ({ ...prev, [maKhoanThu]: [] }));
      alert('Không tìm thấy bản ghi nộp phí phù hợp.');
    }
  };

  const handleNopPhiSearchChange = (maKhoanThu: number, value: string): void => {
    setNopPhiSearchKeyword((prev) => ({ ...prev, [maKhoanThu]: value }));
    if (!value.trim()) {
      setFilteredNopPhiData((prev) => ({
        ...prev,
        [maKhoanThu]: nopPhiData.filter((np) => np.maKhoanThu === maKhoanThu),
      }));
    }
  };

  const handleNopPhiSearchKeyDown = (maKhoanThu: number, e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleNopPhiSearch(maKhoanThu);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Nộp Phí</h2>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bắt buộc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số người đã nộp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền đã thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ghi chú</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đợt thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKhoanThuData.map((row) => {
                  const { soNguoiDaNop, soTienDaThu } = getNopPhiStats(row.maKhoanThu!);
                  return (
                    <React.Fragment key={row.maKhoanThu}>
                      <tr
                        id={`row-${row.maKhoanThu}`}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          highlightedRowId === row.maKhoanThu ? 'bg-yellow-100' : ''
                        }`}
                        onClick={() => handleRowClick(row.maKhoanThu!)}
                      >
                        <td className="px-4 py-3">
                          <span>{expandedRowId === row.maKhoanThu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.maKhoanThu}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.tenKhoanThu}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              row.loaiKhoanThu === 'HOC_PHI'
                                ? 'bg-blue-100 text-blue-800'
                                : row.loaiKhoanThu === 'HOAT_DONG'
                                ? 'bg-purple-100 text-purple-800'
                                : row.loaiKhoanThu === 'DICH_VU'
                                ? 'bg-green-100 text-green-800'
                                : row.loaiKhoanThu === 'DONG_GOP'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {getLoaiKhoanThuLabel(row.loaiKhoanThu)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.soTien?.toLocaleString() || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.batBuoc ? 'Có' : 'Không'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{soNguoiDaNop}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{soTienDaThu.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.ghiChu || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getTenDotThu(row.maDotThu)}</td>
                      </tr>
                      {expandedRowId === row.maKhoanThu && (
                        <tr>
                          <td colSpan={10} className="px-4 py-3 bg-gray-100">
                            <div className="pl-8">
                              <div className="flex items-center space-x-2 mb-4">
                                <select
                                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={nopPhiSearchCriteria[row.maKhoanThu!] || '0'}
                                  onChange={(e) =>
                                    setNopPhiSearchCriteria((prev) => ({
                                      ...prev,
                                      [row.maKhoanThu!]: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="0">Mã bản ghi</option>
                                  <option value="1">Ngày thu</option>
                                  <option value="2">Số tiền</option>
                                  <option value="3">Người nộp</option>
                                  <option value="4">Mã người thu</option>
                                  <option value="5">Mã hộ khẩu</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Tìm kiếm nộp phí"
                                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={nopPhiSearchKeyword[row.maKhoanThu!] || ''}
                                  onChange={(e) => handleNopPhiSearchChange(row.maKhoanThu!, e.target.value)}
                                  onKeyDown={(e) => handleNopPhiSearchKeyDown(row.maKhoanThu!, e)}
                                />
                                <button
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                                  onClick={() => handleNopPhiSearch(row.maKhoanThu!)}
                                >
                                  <FaSearch />
                                  <span>Tìm kiếm</span>
                                </button>
                              </div>
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Danh sách nộp phí</h3>
                              <table className="w-full border-t border-gray-200">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mã bản ghi</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ngày thu</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Số tiền</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Người nộp</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mã người thu</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mã hộ khẩu</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hành động</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {(filteredNopPhiData[row.maKhoanThu!] || []).map((np) => (
                                    <tr key={np.id || Math.random()} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 text-sm text-gray-900">{np.id || '-'}</td>
                                      {editNopPhiId === np.id ? (
                                        <>
                                          <td className="px-4 py-2">
                                            <input
                                              type="text"
                                              name="ngayThu"
                                              value={editNopPhiFormData.ngayThu || ''}
                                              onChange={(e) => handleNopPhiChange(e, false)}
                                              placeholder="DD/MM/YYYY"
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-2">
                                            <input
                                              type="number"
                                              name="soTien"
                                              value={editNopPhiFormData.soTien || 0}
                                              onChange={(e) => handleNopPhiChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-2">
                                            <input
                                              type="text"
                                              name="nguoiNop"
                                              value={editNopPhiFormData.nguoiNop || ''}
                                              onChange={(e) => handleNopPhiChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-2">
                                            <input
                                              type="number"
                                              name="nguoiThuId"
                                              value={editNopPhiFormData.nguoiThuId || 0}
                                              onChange={(e) => handleNopPhiChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-2">
                                            <input
                                              type="number"
                                              name="hoKhauMaHoKhau"
                                              value={editNopPhiFormData.hoKhauMaHoKhau || 0}
                                              onChange={(e) => handleNopPhiChange(e, false)}
                                              className="w-full px-2 py-1 border rounded"
                                            />
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          <td className="px-4 py-2 text-sm text-gray-900">{formatDateDisplay(np.ngayThu)}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{np.soTien?.toLocaleString() || '-'}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{np.nguoiNop || '-'}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{np.idNguoiThu || '-'}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900">{np.maHoKhau || '-'}</td>
                                        </>
                                      )}
                                      <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                          <button
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditNopPhiClick(np);
                                            }}
                                            title={editNopPhiId === np.id ? 'Lưu' : 'Chỉnh sửa'}
                                            disabled={!np.id}
                                          >
                                            {editNopPhiId === np.id ? <FaSave /> : <FaPen />}
                                          </button>
                                          <button
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              np.id && handleDeleteNopPhiClick(np.id);
                                            }}
                                            title="Xóa"
                                            disabled={!np.id}
                                          >
                                            <FaTrashAlt />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {addingNewNopPhi === row.maKhoanThu && (
                                    <tr className="bg-blue-50">
                                      <td className="px-4 py-2 text-sm text-gray-900">-</td>
                                      <td className="px-4 py-2">
                                        <input
                                          type="text"
                                          name="ngayThu"
                                          placeholder="DD/MM/YYYY"
                                          value={newNopPhiData.ngayThu || ''}
                                          onChange={(e) => handleNopPhiChange(e, true)}
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                      <td className="px-4 py-2">
                                        <input
                                          type="number"
                                          name="soTien"
                                          placeholder="Số tiền"
                                          value={newNopPhiData.soTien || 0}
                                          onChange={(e) => handleNopPhiChange(e, true)}
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                      <td className="px-4 py-2">
                                        <input
                                          type="text"
                                          name="nguoiNop"
                                          placeholder="Người nộp"
                                          value={newNopPhiData.nguoiNop || ''}
                                          onChange={(e) => handleNopPhiChange(e, true)}
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                      <td className="px-4 py-2">
                                        <input
                                          type="number"
                                          name="nguoiThuId"
                                          placeholder="Mã người thu"
                                          value={newNopPhiData.nguoiThuId || 0}
                                          onChange={(e) => handleNopPhiChange(e, true)}
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                      <td className="px-4 py-2">
                                        <input
                                          type="number"
                                          name="hoKhauMaHoKhau"
                                          placeholder="Mã hộ khẩu"
                                          value={newNopPhiData.hoKhauMaHoKhau || 0}
                                          onChange={(e) => handleNopPhiChange(e, true)}
                                          className="w-full px-2 py-1 border rounded"
                                        />
                                      </td>
                                      <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                          <button
                                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            onClick={() => handleSaveNewNopPhi(row.maKhoanThu)}
                                            title="Lưu"
                                          >
                                            <FaSave />
                                          </button>
                                          <button
                                            className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                            onClick={handleCancelNewNopPhi}
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
                                onClick={() => handleAddNewNopPhiClick(row.maKhoanThu!)}
                              >
                                <FaPlus />
                                <span>Thêm nộp phí</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
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
            <div className="text-sm text-gray-700">Tổng cộng: {filteredKhoanThuData.length} khoản thu</div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default QLNopPhi;