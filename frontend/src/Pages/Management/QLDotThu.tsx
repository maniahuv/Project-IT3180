import React, { useState } from "react";
import MainLayout from '../../Layout/MainLayout';
import { FaSearch, FaPlus, FaPen, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";

interface DotThu {
  id: string;
  maDotThu: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  moTa: string;
  trangThai: "Đã hoàn thành" | "Chưa hoàn thành";
}

interface NewDotThu {
  id: string;
  maDotThu: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  moTa: string;
  trangThai:"Đã hoàn thành" | "Chưa hoàn thành";
}

const QLDotThu: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState("madotthu");
  const [searchInput, setSearchInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [dotThuList, setDotThuList] = useState<DotThu[]>([
    {
      id: "1",
      maDotThu: "DT2025-01",
      thoiGianBatDau: "2025-01-01",
      thoiGianKetThuc: "2025-01-31",
      moTa: "Đợt thu học phí học kỳ 1 năm 2025",
      trangThai: "Đã hoàn thành"
    }
  ]);
  const [newDotThu, setNewDotThu] = useState<NewDotThu>({
    id: "",
    maDotThu: "",
    thoiGianBatDau: "",
    thoiGianKetThuc: "",
    moTa: "",
    trangThai: "Chưa hoàn thành",
  });
  const [editingData, setEditingData] = useState<DotThu | null>(null);
  
  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching with criteria:", searchCriteria, "and input:", searchInput);
  };
  
  const handleAddNew = () => {
    if (isAdding) return;
  
    // Lấy id lớn nhất hiện tại và tự động tăng
    const nextId =
      dotThuList.length > 0
        ? (Math.max(...dotThuList.map(item => parseInt(item.id))) + 1).toString()
        : "1";
  
    setIsAdding(true);
    setNewDotThu({
      id: nextId, // ID được tự động gán, không cho phép chỉnh sửa
      maDotThu: "",
      thoiGianBatDau: "",
      thoiGianKetThuc: "",
      moTa: "",
      trangThai: "Chưa hoàn thành"
    });
  };
  
  const handleSaveNew = () => {
    // Bỏ validation cho ID vì ID đã được tự động gán
    if (!newDotThu.maDotThu.trim()) {
      alert("Vui lòng nhập Mã đợt thu.");
      return;
    }
    
    // Kiểm tra trùng lặp mã đợt thu
    if (dotThuList.some(item => item.maDotThu === newDotThu.maDotThu.trim())) {
      alert("Mã đợt thu đã tồn tại. Vui lòng nhập mã khác.");
      return;
    }
    
    if (newDotThu.thoiGianBatDau && newDotThu.thoiGianKetThuc && 
        newDotThu.thoiGianBatDau > newDotThu.thoiGianKetThuc) {
      alert("Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc.");
      return;
    }
    
    setDotThuList([...dotThuList, { ...newDotThu }]);
    setIsAdding(false);
    // Reset form
    setNewDotThu({
      id: "",
      maDotThu: "",
      thoiGianBatDau: "",
      thoiGianKetThuc: "",
      moTa: "",
      trangThai: "Chưa hoàn thành"
    });
  };
  
  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewDotThu({
      id: "",
      maDotThu: "",
      thoiGianBatDau: "",
      thoiGianKetThuc: "",
      moTa: "",
      trangThai: "Chưa hoàn thành"
    });
  };
  
  const handleEdit = (item: DotThu) => {
    if (editingId === item.id) {
      // Save changes - kiểm tra validation trước khi lưu
      if (editingData) {
        if (!editingData.maDotThu.trim()) {
          alert("Vui lòng nhập Mã đợt thu.");
          return;
        }
        
        // Kiểm tra trùng lặp mã đợt thu (trừ chính nó)
        if (dotThuList.some(dt => dt.id !== item.id && dt.maDotThu === editingData.maDotThu.trim())) {
          alert("Mã đợt thu đã tồn tại. Vui lòng nhập mã khác.");
          return;
        }
        
        if (editingData.thoiGianBatDau && editingData.thoiGianKetThuc && 
            editingData.thoiGianBatDau > editingData.thoiGianKetThuc) {
          alert("Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc.");
          return;
        }
        
        setDotThuList(dotThuList.map(dt => 
          dt.id === item.id ? editingData : dt
        ));
      }
      setEditingId(null);
      setEditingData(null);
    } else {
      // Start editing
      setEditingId(item.id);
      setEditingData({ ...item });
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa đợt thu này?")) {
      setDotThuList(dotThuList.filter(item => item.id !== id));
    }
  };
  
  const updateEditingData = (field: keyof DotThu, value: string) => {
    if (editingData) {
      // Không cho phép chỉnh sửa ID
      if (field === 'id') {
        return;
      }
      
      setEditingData({
        ...editingData,
        [field]: value
      });
    }
  };



  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đợt thu</h2>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex flex-1 gap-2">
              <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="madotthu">Mã đợt thu</option>
                <option value="thoigianbatdau">Thời gian bắt đầu</option>
                <option value="thoigianketthuc">Thời gian kết thúc</option>
                <option value="mota">Mô tả</option>
                <option value="trangthai">Trạng thái</option>
              </select>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaSearch />
                Tìm kiếm
              </button>
            </div>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Tạo mới
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Mã đợt thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Thời gian bắt đầu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Thời gian kết thúc</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Mô tả</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Existing data rows */}
                {dotThuList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                     {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={editingData?.maDotThu || ""}
                          onChange={(e) => updateEditingData("maDotThu", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        item.maDotThu
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {editingId === item.id ? (
                        <input
                          type="date"
                          value={editingData?.thoiGianBatDau || ""}
                          onChange={(e) => updateEditingData("thoiGianBatDau", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        item.thoiGianBatDau
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {editingId === item.id ? (
                        <input
                          type="date"
                          value={editingData?.thoiGianKetThuc || ""}
                          onChange={(e) => updateEditingData("thoiGianKetThuc", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        item.thoiGianKetThuc
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={editingData?.moTa || ""}
                          onChange={(e) => updateEditingData("moTa", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        item.moTa
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {editingId === item.id ? (
                        <select
                        value={editingData?.trangThai}
                        onChange={(e) => updateEditingData("trangThai", e.target.value as "Đã thanh toán" | "Chưa thanh toán" )}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                        <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.trangThai === "Đã hoàn thành" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.trangThai}
                      </span>
                      //   <input
                      //     type="text"
                      //     value={editingData?.trangThai || ""}
                      //     onChange={(e) => updateEditingData("trangThai", e.target.value)}
                      //     className="w-full px-2 py-1 border border-gray-300 rounded"
                      //   />
                      // ) : (
                      //   item.trangThai
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={editingId === item.id ? "Lưu" : "Sửa"}
                        >
                          {editingId === item.id ? <FaSave /> : <FaPen />}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Add new row */}
                {isAdding && (
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3">
                      {/* <input
                        type="text"
                        value={newDotThu.id}
                        // onChange={(e) => setNewDotThu({...newDotThu, id: e.target.value})}
                        placeholder="ID"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      /> */}
                      {newDotThu.id}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={newDotThu.maDotThu}
                        onChange={(e) => setNewDotThu({...newDotThu, maDotThu: e.target.value})}
                        placeholder="Mã đợt thu"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={newDotThu.thoiGianBatDau}
                        onChange={(e) => setNewDotThu({...newDotThu, thoiGianBatDau: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={newDotThu.thoiGianKetThuc}
                        onChange={(e) => setNewDotThu({...newDotThu, thoiGianKetThuc: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={newDotThu.moTa}
                        onChange={(e) => setNewDotThu({...newDotThu, moTa: e.target.value})}
                        placeholder="Mô tả"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                    <select
                         value={newDotThu.trangThai}
                         onChange={(e) => setNewDotThu({...newDotThu, trangThai: e.target.value as "Đã hoàn thành" | "Chưa hoàn thành"})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                        <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                      </select>
                     
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveNew}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Lưu"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancelAdd}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">
                Hiển thị
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="mx-2 px-2 py-1 border border-gray-300 rounded"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                mục
              </label>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QLDotThu;