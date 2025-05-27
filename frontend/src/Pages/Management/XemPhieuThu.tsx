import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import MainLayout from '../../Layout/MainLayout';

interface Receipt {
  id: number;
  maPhieuThu: string;
  maHoKhau: string;
  maDotThu: string;
  tongTien: number;
  hanNop: string;
  trangThai: string;
}

interface EditingReceipt extends Receipt {
  isEditing: boolean;
}

const XemPhieuThu: React.FC = () => {
  const [receipts, setReceipts] = useState<EditingReceipt[]>([
    {
      id: 1,
      maPhieuThu: '1',
      maHoKhau: 'HK001',
      maDotThu: 'DT001',
      tongTien: 100,
      hanNop: '01/05/2022',
      trangThai: 'Hoạt động',
      isEditing: false
    }
  ]);

  const [searchCriteria, setSearchCriteria] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newReceipt, setNewReceipt] = useState<Partial<Receipt>>({
    maPhieuThu: '',
    maHoKhau: '',
    maDotThu: '',
    tongTien: 0,
    hanNop: '',
    trangThai: ''
  });

  const searchOptions = [
    'Mã phiếu thu',
    'Mã hộ khẩu', 
    'Mã đợt thu',
    'Tổng tiền',
    'Hạn nộp',
    'Trạng thái'
  ];

  const formatDateISO = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
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

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }

    const keyword = searchKeyword.toLowerCase().trim();
    const foundReceipt = receipts.find(receipt => {
      const values = [
        receipt.maPhieuThu,
        receipt.maHoKhau,
        receipt.maDotThu,
        receipt.tongTien.toString(),
        receipt.hanNop,
        receipt.trangThai
      ];
      return values[searchCriteria].toLowerCase().includes(keyword);
    });

    if (foundReceipt) {
      setHighlightedId(foundReceipt.id);
      setTimeout(() => setHighlightedId(null), 3000);
    } else {
      alert('Không tìm thấy phiếu thu phù hợp.');
    }
  };

  const handleEdit = (id: number) => {
    setReceipts(prev => prev.map(receipt => 
      receipt.id === id 
        ? { ...receipt, isEditing: !receipt.isEditing }
        : receipt
    ));
  };

  const handleSave = (id: number, updatedData: Partial<Receipt>) => {
    setReceipts(prev => prev.map(receipt => 
      receipt.id === id 
        ? { ...receipt, ...updatedData, isEditing: false }
        : receipt
    ));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa phiếu thu này?')) {
      setReceipts(prev => prev.filter(receipt => receipt.id !== id));
    }
  };

  const handleAddNew = () => {
    if (!newReceipt.maPhieuThu?.trim()) {
      alert('Vui lòng nhập mã phiếu thu.');
      return;
    }

    const maxId = Math.max(...receipts.map(r => r.id), 0);
    const receipt: EditingReceipt = {
      id: maxId + 1,
      maPhieuThu: newReceipt.maPhieuThu || '',
      maHoKhau: newReceipt.maHoKhau || '',
      maDotThu: newReceipt.maDotThu || '',
      tongTien: newReceipt.tongTien || 0,
      hanNop: newReceipt.hanNop || '',
      trangThai: newReceipt.trangThai || '',
      isEditing: false
    };

    setReceipts(prev => [...prev, receipt]);
    setNewReceipt({
      maPhieuThu: '',
      maHoKhau: '',
      maDotThu: '',
      tongTien: 0,
      hanNop: '',
      trangThai: ''
    });
    setIsAdding(false);
  };

  const EditableCell: React.FC<{
    value: string | number;
    type?: 'text' | 'number' | 'date';
    isEditing: boolean;
    onChange: (value: string) => void;
  }> = ({ value, type = 'text', isEditing, onChange }) => {
    if (!isEditing) {
      return <span>{type === 'date' && typeof value === 'string' ? value : value}</span>;
    }

    if (type === 'date') {
      return (
        <input
          type="date"
          value={formatDateISO(value.toString())}
          onChange={(e) => onChange(formatDateDisplay(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
        />
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 border rounded text-sm"
      />
    );
  };

  return (
    <MainLayout>  <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Xem Phiếu Thu</h2>

      {/* Search and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <select 
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {searchOptions.map((option, index) => (
              <option key={index} value={index}>{option}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Search size={16} />
            <span>Tìm kiếm</span>
          </button>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Tạo mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã phiếu thu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã hộ khẩu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đợt thu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn nộp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.map((receipt) => (
              <tr 
                key={receipt.id}
                className={`${highlightedId === receipt.id ? 'bg-green-100 transition-colors duration-500' : 'hover:bg-gray-50'}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{receipt.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EditableCell
                    value={receipt.maHoKhau}
                    isEditing={receipt.isEditing}
                    onChange={(value) => setReceipts(prev => prev.map(r => 
                      r.id === receipt.id ? { ...r, maHoKhau: value } : r
                    ))}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EditableCell
                    value={receipt.maDotThu}
                    isEditing={receipt.isEditing}
                    onChange={(value) => setReceipts(prev => prev.map(r => 
                      r.id === receipt.id ? { ...r, maDotThu: value } : r
                    ))}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EditableCell
                    value={receipt.tongTien}
                    type="number"
                    isEditing={receipt.isEditing}
                    onChange={(value) => setReceipts(prev => prev.map(r => 
                      r.id === receipt.id ? { ...r, tongTien: parseInt(value) || 0 } : r
                    ))}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EditableCell
                    value={receipt.hanNop}
                    type="date"
                    isEditing={receipt.isEditing}
                    onChange={(value) => setReceipts(prev => prev.map(r => 
                      r.id === receipt.id ? { ...r, hanNop: value } : r
                    ))}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EditableCell
                    value={receipt.trangThai}
                    isEditing={receipt.isEditing}
                    onChange={(value) => setReceipts(prev => prev.map(r => 
                      r.id === receipt.id ? { ...r, trangThai: value } : r
                    ))}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(receipt.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      {receipt.isEditing ? <Save size={14} /> : <Edit2 size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(receipt.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Add new row */}
            {isAdding && (
              <tr className="bg-yellow-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {Math.max(...receipts.map(r => r.id), 0) + 1}
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    placeholder="Mã hộ khẩu"
                    value={newReceipt.maHoKhau || ''}
                    onChange={(e) => setNewReceipt(prev => ({ ...prev, maHoKhau: e.target.value }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    placeholder="Mã đợt thu"
                    value={newReceipt.maDotThu || ''}
                    onChange={(e) => setNewReceipt(prev => ({ ...prev, maDotThu: e.target.value }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    placeholder="Tổng tiền"
                    value={newReceipt.tongTien || ''}
                    onChange={(e) => setNewReceipt(prev => ({ ...prev, tongTien: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="date"
                    value={formatDateISO(newReceipt.hanNop || '')}
                    onChange={(e) => setNewReceipt(prev => ({ ...prev, hanNop: formatDateDisplay(e.target.value) }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <input
                    type="text"
                    placeholder="Trạng thái"
                    value={newReceipt.trangThai || ''}
                    onChange={(e) => setNewReceipt(prev => ({ ...prev, trangThai: e.target.value }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddNew}
                      className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-start">
        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Hiển thị</span>
          <select className="px-2 py-1 border border-gray-300 rounded">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>mục</span>
        </label>
      </div>
    </div></MainLayout>
  
  );
};

export default XemPhieuThu;