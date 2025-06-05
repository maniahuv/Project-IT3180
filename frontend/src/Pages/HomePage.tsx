import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import {
  FaAddressBook, FaUser, FaCalendarCheck, FaEnvelopeOpenText,
  FaCalendarDay, FaPen, FaTrashAlt, FaBug, FaFileAlt
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { DotThu, fetchAllDotThu } from '../api/DotThuApi';
import { HoKhau, fetchAllHoKhau } from '../api/HoKhauApi';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface NotifyIssue {
  id: number;
  date: string;
  type: string;
  content: string;
  status: 'Chờ xử lý' | 'Đã gửi' | 'Đã xử lý';
  category: 'Thông báo' | 'Sự cố';
}

const HomePage: React.FC = () => {
  // HoKhau data from API
  const [hoKhauData, setHoKhauData] = useState<HoKhau[]>([]);
  const [loadingHoKhau, setLoadingHoKhau] = useState<boolean>(true);
  const [errorHoKhau, setErrorHoKhau] = useState<string>('');

  // DotThu data for collection completion percentage
  const [dotThuData, setDotThuData] = useState<DotThu[]>([]);
  const [loadingDotThu, setLoadingDotThu] = useState<boolean>(true);
  const [errorDotThu, setErrorDotThu] = useState<string>('');

  // NotifyIssue data
  const [items, setItems] = useState<NotifyIssue[]>([
    { id: 1, date: '25/05/2025', type: 'Sự cố điện', content: 'Mất điện tầng 3', status: 'Chờ xử lý', category: 'Sự cố' },
    { id: 2, date: '24/05/2025', type: 'Thông báo chung', content: 'Lịch họp cư dân tháng 6', status: 'Đã gửi', category: 'Thông báo' },
    { id: 3, date: '20/05/2025', type: 'Bảo trì', content: 'Bảo trì hệ thống thang máy', status: 'Chờ xử lý', category: 'Sự cố' },
  ]);

  // Modal states
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NotifyIssue | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    content: '',
    status: 'Chờ xử lý',
  });

  // Fetch HoKhau data
  useEffect(() => {
    const loadHoKhauData = async () => {
      try {
        setLoadingHoKhau(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const response = await fetchAllHoKhau();
        setHoKhauData(response.data);
        setErrorHoKhau('');
      } catch (err: any) {
        setErrorHoKhau('Có lỗi xảy ra khi tải dữ liệu hộ khẩu: ' + (err.response?.data?.message || err.message));
        console.error('Error loading ho khau:', err);
        setHoKhauData([]);
        if (err.response?.status === 401) {
          setErrorHoKhau('Phiên đăng nhập không hợp lệ.');
          localStorage.removeItem('token');
        }
      } finally {
        setLoadingHoKhau(false);
      }
    };
    loadHoKhauData();
  }, []);

  // Fetch DotThu data
  useEffect(() => {
    const loadDotThuData = async () => {
      try {
        setLoadingDotThu(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const response = await fetchAllDotThu();
        let dotThuArray: DotThu[] = [];
        if (typeof response.data === 'string') {
          dotThuArray = JSON.parse(response.data);
        } else if (Array.isArray(response.data)) {
          dotThuArray = response.data;
        }
        setDotThuData(dotThuArray);
        setErrorDotThu('');
      } catch (err: any) {
        setErrorDotThu('Có lỗi xảy ra khi tải dữ liệu đợt thu: ' + (err.response?.data?.message || err.message));
        console.error('Error loading dot thu:', err);
        setDotThuData([]);
        if (err.response?.status === 401) {
          setErrorDotThu('Phiên đăng nhập không hợp lệ.');
          localStorage.removeItem('token');
        }
      } finally {
        setLoadingDotThu(false);
      }
    };
    loadDotThuData();
  }, []);

  // Calculate DotThu completion percentage
  const calculateDotThuCompletion = (): string => {
    if (loadingDotThu || errorDotThu || dotThuData.length === 0) return '0%';
    const completed = dotThuData.filter(dt => dt.trangThai === 'DA_HOAN_THANH').length;
    const percentage = ((completed / dotThuData.length) * 100).toFixed(0);
    return `${percentage}% đã hoàn thành`;
  };

  // Process residents data for charts (floors 1–10 and 11–20)
  const getResidentsByFloor = (startFloor: number, endFloor: number) => {
    const residentsByFloor: number[] = Array(endFloor - startFloor + 1).fill(0);

    // Parse soNha: first two digits as floor number (e.g., '0102' → 1, '1202' → 12)
    hoKhauData.forEach(hk => {
      const floorStr = hk.soNha?.slice(0, 2); // Get first two digits
      const floor = parseInt(floorStr, 10);
      if (!isNaN(floor) && floor >= startFloor && floor <= endFloor) {
        const residentCount = hk.danhSachNhanKhau?.length || 0;
        residentsByFloor[floor - startFloor] += residentCount;
      }
    });

    // Generate labels for the specified floor range
    const labels = Array.from({ length: endFloor - startFloor + 1 }, (_, i) => `Tầng ${startFloor + i}`);

    return {
      labels,
      datasets: [
        {
          label: 'Số nhân khẩu',
          data: residentsByFloor,
          backgroundColor: 'rgba(59, 130, 246, 0.7)', // Tailwind blue-500
          barThickness: 30, // Fixed bar width
        },
      ],
    };
  };

  // Calculate total residents
  const totalResidents = hoKhauData.reduce((sum, hk) => sum + (hk.danhSachNhanKhau?.length || 0), 0);

  // Modal handlers
  const openModalForCategory = (category: 'Thông báo' | 'Sự cố', item?: NotifyIssue) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        date: item.date,
        type: item.type,
        content: item.content,
        status: item.status,
      });
      if (category === 'Thông báo') setShowNotifyModal(true);
      else setShowIssueModal(true);
    } else {
      setEditingItem(null);
      setFormData({ date: '', type: '', content: '', status: 'Chờ xử lý' });
      if (category === 'Thông báo') setShowNotifyModal(true);
      else setShowIssueModal(true);
    }
  };

  const closeModals = () => {
    setShowNotifyModal(false);
    setShowIssueModal(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent, category: 'Thông báo' | 'Sự cố') => {
    e.preventDefault();
    const formattedDate = formatDateForDisplay(formData.date);
    if (editingItem) {
      setItems(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData, date: formattedDate, status: formData.status as NotifyIssue['status'], category }
            : item
        )
      );
    } else {
      const newItem: NotifyIssue = {
        id: Date.now(),
        ...formData,
        date: formattedDate,
        status: formData.status as NotifyIssue['status'],
        category,
      };
      setItems(prev => [newItem, ...prev]);
    }
    closeModals();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Issues chart data
  const issuesByType = items
    .filter(i => i.category === 'Sự cố')
    .reduce<Record<string, number>>((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + 1;
      return acc;
    }, {});

  const issuesData = {
    labels: Object.keys(issuesByType),
    datasets: [
      {
        label: 'Số sự cố',
        data: Object.values(issuesByType),
        backgroundColor: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'],
      },
    ],
  };

  return (
    <MainLayout>
      <section className="p-6">
        <h2 className="text-xl font-semibold mb-4">Chung cư BlueMoon</h2>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <DashboardCard
            title="Tổng số hộ khẩu"
            value={loadingHoKhau ? 'Đang tải...' : errorHoKhau ? 'Lỗi' : hoKhauData.length.toString()}
            icon={<FaAddressBook />}
          />
          <DashboardCard
            title="Tổng số nhân khẩu"
            value={loadingHoKhau ? 'Đang tải...' : errorHoKhau ? 'Lỗi' : totalResidents.toString()}
            icon={<FaUser />}
          />
          <DashboardCard
            title="Đợt thu"
            value={loadingDotThu ? 'Đang tải...' : errorDotThu ? 'Lỗi' : calculateDotThuCompletion()}
            icon={<FaCalendarCheck />}
          />
          <DashboardCard
            title="Số yêu cầu mới"
            value={items.filter(i => i.status === 'Chờ xử lý').length.toString()}
            icon={<FaEnvelopeOpenText />}
          />
          <DashboardCard title="Lịch bảo trì" value="2 sự kiện" icon={<FaCalendarDay />} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Phân bố nhân khẩu theo tầng</h3>
            {loadingHoKhau ? (
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : errorHoKhau ? (
              <p className="text-center text-red-500">{errorHoKhau}</p>
            ) : (
              <div className="space-y-6">
                {/* Chart for Floors 1–10 */}
                <div>
                  <h4 className="text-md font-medium mb-2">Tầng 1–10</h4>
                  <div style={{ width: '600px', height: '300px' }}>
                    <Bar
                      data={getResidentsByFloor(1, 10)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          title: { display: false },
                          tooltip: { enabled: true, mode: 'index', intersect: false },
                        },
                        scales: {
                          x: {
                            ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 },
                            grid: { display: false },
                          },
                          y: { beginAtZero: true, grid: { display: true } },
                        },
                        animation: { duration: 0 }, // Disable animations to prevent layout shifts
                        hover: { mode: 'index', intersect: false }, // Controlled hover behavior
                      }}
                    />
                  </div>
                </div>
                {/* Chart for Floors 11–20 */}
                <div>
                  <h4 className="text-md font-medium mb-2">Tầng 11–20</h4>
                  <div style={{ width: '600px', height: '300px' }}>
                    <Bar
                      data={getResidentsByFloor(11, 20)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          title: { display: false },
                          tooltip: { enabled: true, mode: 'index', intersect: false },
                        },
                        scales: {
                          x: {
                            ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 },
                            grid: { display: false },
                          },
                          y: { beginAtZero: true, grid: { display: true } },
                        },
                        animation: { duration: 0 }, // Disable animations
                        hover: { mode: 'index', intersect: false },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Số sự cố theo loại (tháng này)</h3>
            {issuesData.labels.length > 0 ? (
              <Pie data={issuesData} options={{ responsive: true }} />
            ) : (
              <p className="text-center text-gray-500">Chưa có sự cố nào</p>
            )}
          </div>
        </div>

        {/* Notify & Issues Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Thông báo & sự cố mới nhất</h3>
          <table className="w-full table-auto text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Ngày</th>
                <th className="border p-2">Loại</th>
                <th className="border p-2">Nội dung</th>
                <th className="border p-2">Trạng thái</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="border p-2">{item.date}</td>
                  <td className="border p-2">{item.type}</td>
                  <td className="border p-2">{item.content}</td>
                  <td className={`border p-2 ${item.status === 'Chờ xử lý' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {item.status}
                  </td>
                  <td className="border p-2 space-x-2 text-center">
                    <button
                      title="Chỉnh sửa"
                      className="hover:text-blue-600"
                      onClick={() => openModalForCategory(item.category, item)}
                    >
                      <FaPen />
                    </button>
                    <button
                      title="Xóa"
                      className="hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Create Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              className="btn-action bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-red-600 transition"
              onClick={() => openModalForCategory('Sự cố')}
            >
              <FaBug /> Báo sự cố mới
            </button>
            <button
              className="btn-action bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-blue-600 transition"
              onClick={() => openModalForCategory('Thông báo')}
            >
              <FaFileAlt /> Tạo thông báo mới
            </button>
          </div>
        </div>
      </section>

      {/* Modal for Add/Edit */}
      {(showNotifyModal || showIssueModal) && (
        <Modal
          title={editingItem ? 'Chỉnh sửa' : showNotifyModal ? 'Tạo thông báo mới' : 'Báo sự cố mới'}
          onClose={closeModals}
        >
          <form onSubmit={e => handleSubmit(e, showNotifyModal ? 'Thông báo' : 'Sự cố')} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Ngày</label>
              <input
                type="date"
                value={formData.date ? formatDateForInput(formData.date) : ''}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Loại {showNotifyModal ? 'thông báo' : 'sự cố'}</label>
              <input
                type="text"
                placeholder={`Nhập loại ${showNotifyModal ? 'thông báo' : 'sự cố'}`}
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nội dung</label>
              <textarea
                placeholder={`Nội dung ${showNotifyModal ? 'thông báo' : 'sự cố'}`}
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                required
                rows={4}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Trạng thái</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đã gửi">Đã gửi</option>
                <option value="Đã xử lý">Đã xử lý</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  showNotifyModal ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {editingItem ? 'Lưu' : 'Gửi'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </MainLayout>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div tabIndex={0} className="dashboard-card bg-white p-4 rounded-lg shadow flex items-center gap-4">
    <div className="text-2xl text-blue-600">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  </div>
);

// Modal Component
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  </>
);

// Date formatting functions
function formatDateForInput(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

function formatDateForDisplay(dateStr: string): string {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default HomePage;