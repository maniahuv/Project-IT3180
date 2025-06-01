import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../Layout/MainLayout';
import {
  FaQuestionCircle, FaCaretDown, FaAddressBook, FaBuilding, FaCalendarCheck, FaEnvelopeOpenText,
  FaCalendarDay, FaPen, FaTrashAlt, FaBug, FaFileAlt, FaUser, FaUserPlus, FaSignOutAlt
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

// Đăng ký các thành phần chart
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
  // Dữ liệu mẫu
  const [items, setItems] = useState<NotifyIssue[]>([
    { id: 1, date: '25/05/2025', type: 'Sự cố điện', content: 'Mất điện tầng 3', status: 'Chờ xử lý', category: 'Sự cố' },
    { id: 2, date: '24/05/2025', type: 'Thông báo chung', content: 'Lịch họp cư dân tháng 6', status: 'Đã gửi', category: 'Thông báo' },
    { id: 3, date: '20/05/2025', type: 'Bảo trì', content: 'Bảo trì hệ thống thang máy', status: 'Chờ xử lý', category: 'Sự cố' },
  ]);

  // State modal
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Modal sửa (chung)
  const [editingItem, setEditingItem] = useState<NotifyIssue | null>(null);

  // Form state đơn giản cho modal thêm/sửa
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    content: '',
    status: 'Chờ xử lý',
  });

  // Mở modal tạo mới hoặc sửa
  const openModalForCategory = (category: 'Thông báo' | 'Sự cố', item?: NotifyIssue) => {
    if (item) {
      // Sửa
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
      // Tạo mới
      setEditingItem(null);
      setFormData({ date: '', type: '', content: '', status: 'Chờ xử lý' });
      if (category === 'Thông báo') setShowNotifyModal(true);
      else setShowIssueModal(true);
    }
  };

  // Đóng tất cả modal
  const closeModals = () => {
    setShowNotifyModal(false);
    setShowIssueModal(false);
    setEditingItem(null);
  };

  // Xử lý submit form (thêm hoặc sửa)
  const handleSubmit = (e: React.FormEvent, category: 'Thông báo' | 'Sự cố') => {
    e.preventDefault();

    if (editingItem) {
      // Sửa
      setItems(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData, status: formData.status as NotifyIssue['status'], category }
            : item
        )
      );
    } else {
      // Thêm mới
      const newItem: NotifyIssue = {
        id: Date.now(),
        ...formData,
        status: formData.status as NotifyIssue['status'],
        category,
      };
      setItems(prev => [newItem, ...prev]);
    }
    closeModals();
  };

  // Xóa item
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Data Chart Phân bố cư dân theo tầng (giả lập)
  const residentsData = {
    labels: ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4', 'Tầng 5'],
    datasets: [
      {
        label: 'Số cư dân',
        data: [50, 70, 45, 60, 40],
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Tailwind blue-500
      },
    ],
  };

  // Data Chart Số sự cố theo loại (tháng này)
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
        backgroundColor: [
          '#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'
        ],
      },
    ],
  };

  return (
    <MainLayout>
  
      <section className="p-6">
        <h2 className="text-xl font-semibold mb-4">Chung cư BlueMoon</h2>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <DashboardCard title="Tổng số hộ khẩu" value="350" icon={<FaAddressBook />} />
          <DashboardCard title="Số căn hộ" value="120" icon={<FaBuilding />} />
          <DashboardCard title="Đợt thu" value="95% đã đóng" icon={<FaCalendarCheck />} />
          <DashboardCard title="Số yêu cầu mới" value={items.filter(i => i.status === 'Chờ xử lý').length.toString()} icon={<FaEnvelopeOpenText />} />
          <DashboardCard title="Lịch bảo trì" value="2 sự kiện" icon={<FaCalendarDay />} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Phân bố cư dân theo tầng</h3>
            <Bar data={residentsData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Số sự cố theo loại (tháng này)</h3>
            {issuesData.labels.length > 0
              ? <Pie data={issuesData} options={{ responsive: true }} />
              : <p className="text-center text-gray-500">Chưa có sự cố nào</p>
            }
          </div>
        </div>

        {/* Thông báo & Sự cố mới nhất */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Thông báo &amp; sự cố mới nhất</h3>
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
                  <td className={`border p-2 ${item.status === 'Chờ xử lý' ? 'text-yellow-600' : 'text-green-600'}`}>{item.status}</td>
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

          {/* Nút tạo mới */}
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

      {/* Modal chung thêm/sửa */}
      {(showNotifyModal || showIssueModal) && (
        <Modal title={editingItem ? 'Chỉnh sửa' : (showNotifyModal ? 'Tạo thông báo mới' : 'Báo sự cố mới')} onClose={closeModals}>
          <form onSubmit={(e) => handleSubmit(e, showNotifyModal ? 'Thông báo' : 'Sự cố')} className="space-y-4">
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
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option>Chờ xử lý</option>
                <option>Đã gửi</option>
                <option>Đã xử lý</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModals} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Hủy</button>
              <button type="submit" className={`px-4 py-2 rounded text-white ${showNotifyModal ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}>
                {editingItem ? 'Lưu' : 'Gửi'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </MainLayout>
  );
};

export default HomePage;

const DashboardCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div tabIndex={0} className="dashboard-card bg-white p-4 rounded-lg shadow flex items-center gap-4">
    <div className="text-2xl text-blue-600">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  </div>
);

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <>
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
    />
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
    </div>
  </>
);

// Hàm chuyển đổi ngày dd/mm/yyyy sang yyyy-mm-dd cho input[type=date]
function formatDateForInput(dateStr: string) {
  // dateStr dạng dd/mm/yyyy
  const parts = dateStr.split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
}
