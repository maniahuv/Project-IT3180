import React, { useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import { FaSearch, FaPlus, FaPen, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";

interface KhoanThu {
  id: number;
  maKhoanThu: string;
  maDotThu: string;
  maHoKhau: string;
  maLoaiKhoanThu: string;
  soTienPhaiNop: number;
  ngayNop: string;
  trangThaiThanhToan: "Đã thanh toán" | "Chưa thanh toán";
}

interface EditingRow {
  id: number;
  maKhoanThu: string;
  maDotThu: string;
  maHoKhau: string;
  maLoaiKhoanThu: string;
  soTienPhaiNop: string;
  ngayNop: string;
  trangThaiThanhToan: "Đã thanh toán" | "Chưa thanh toán";
}

interface NewRow {
  maKhoanThu: string;
  maDotThu: string;
  maHoKhau: string;
  maLoaiKhoanThu: string;
  soTienPhaiNop: string;
  ngayNop: string;
  trangThaiThanhToan: "Đã thanh toán" | "Chưa thanh toán";
}

export default function QLKhoanThu() {
  const [khoanThus, setKhoanThus] = useState<KhoanThu[]>([
    {
      id: 1,
      maKhoanThu: "KT001",
      maDotThu: "DT2024A",
      maHoKhau: "HK123",
      maLoaiKhoanThu: "LT001",
      soTienPhaiNop: 500000,
      ngayNop: "2024-05-01",
      trangThaiThanhToan: "Đã thanh toán",
    },
    {
      id: 2,
      maKhoanThu: "KT002",
      maDotThu: "DT2024B",
      maHoKhau: "HK124",
      maLoaiKhoanThu: "LT002",
      soTienPhaiNop: 300000,
      ngayNop: "2024-05-15",
      trangThaiThanhToan: "Chưa thanh toán",
    },
  ]);

  const [searchCriteria, setSearchCriteria] = useState("makhoanthu");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRow, setNewRow] = useState<NewRow>({
    maKhoanThu: "",
    maDotThu: "",
    maHoKhau: "",
    maLoaiKhoanThu: "",
    soTienPhaiNop: "",
    ngayNop: "",
    trangThaiThanhToan: "Chưa thanh toán",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSearch = () => {
    // Filter logic would be implemented here
    // For now, we'll just filter based on the search criteria and keyword
  };

  const handleEdit = (khoanThu: KhoanThu) => {
    setEditingRow({
      id: khoanThu.id,
      maKhoanThu: khoanThu.maKhoanThu,
      maDotThu: khoanThu.maDotThu,
      maHoKhau: khoanThu.maHoKhau,
      maLoaiKhoanThu: khoanThu.maLoaiKhoanThu,
      soTienPhaiNop: khoanThu.soTienPhaiNop.toString(),
      ngayNop: khoanThu.ngayNop,
      trangThaiThanhToan: khoanThu.trangThaiThanhToan,
    });
  };

  const handleSaveEdit = () => {
    if (!editingRow) return;

    if (!editingRow.maKhoanThu.trim() || !editingRow.maDotThu.trim() || !editingRow.soTienPhaiNop.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setKhoanThus(prev =>
      prev.map(item =>
        item.id === editingRow.id
          ? {
              ...item,
              maKhoanThu: editingRow.maKhoanThu,
              maDotThu: editingRow.maDotThu,
              maHoKhau: editingRow.maHoKhau,
              maLoaiKhoanThu: editingRow.maLoaiKhoanThu,
              soTienPhaiNop: parseInt(editingRow.soTienPhaiNop) || 0,
              ngayNop: editingRow.ngayNop,
              trangThaiThanhToan: editingRow.trangThaiThanhToan,
            }
          : item
      )
    );
    setEditingRow(null);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleDelete = (id: number) => {
    const userConfirmed = window.confirm("Bạn có chắc muốn xóa khoản thu này?");
    if (!userConfirmed) return;
    setKhoanThus(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewRow({
      maKhoanThu: "",
      maDotThu: "",
      maHoKhau: "",
      maLoaiKhoanThu: "",
      soTienPhaiNop: "",
      ngayNop: "",
      trangThaiThanhToan: "Chưa thanh toán",
    });
  };

  const handleSaveNew = () => {
    if (!newRow.maKhoanThu.trim() || !newRow.maDotThu.trim() || !newRow.soTienPhaiNop.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    const maxId = Math.max(...khoanThus.map(item => item.id), 0);
    const newKhoanThu: KhoanThu = {
      id: maxId + 1,
      maKhoanThu: newRow.maKhoanThu,
      maDotThu: newRow.maDotThu,
      maHoKhau: newRow.maHoKhau,
      maLoaiKhoanThu: newRow.maLoaiKhoanThu,
      soTienPhaiNop: parseInt(newRow.soTienPhaiNop) || 0,
      ngayNop: newRow.ngayNop,
      trangThaiThanhToan: newRow.trangThaiThanhToan,
    };

    setKhoanThus(prev => [newKhoanThu, ...prev]);
    setIsAddingNew(false);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  const filteredKhoanThus = khoanThus.filter(item => {
    if (!searchKeyword.trim()) return true;
    
    const keyword = searchKeyword.toLowerCase();
    switch (searchCriteria) {
      case "makhoanthu":
        return item.maKhoanThu.toLowerCase().includes(keyword);
      case "madotthu":
        return item.maDotThu.toLowerCase().includes(keyword);
      case "mahokhau":
        return item.maHoKhau.toLowerCase().includes(keyword);
      case "maloaikhoanthu":
        return item.maLoaiKhoanThu.toLowerCase().includes(keyword);
      case "trangthaithanhtoan":
        return item.trangThaiThanhToan.toLowerCase().includes(keyword);
      default:
        return true;
    }
  });

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Quản lý khoản thu</h2>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="makhoanthu">Mã khoản thu</option>
                <option value="madotthu">Mã đợt thu</option>
                <option value="mahokhau">Mã hộ khẩu</option>
                <option value="maloaikhoanthu">Mã loại khoản thu</option>
                <option value="trangthaithanhtoan">Trạng thái thanh toán</option>
              </select>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-64"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaSearch />
                Tìm kiếm
              </button>
            </div>

            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaPlus />
              Tạo mới
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Mã khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Mã đợt thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Mã hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Mã loại khoản thu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Số tiền phải nộp (VNĐ)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Ngày nộp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Trạng thái thanh toán</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {/* New Row */}
                {isAddingNew && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-3 border border-gray-300 text-sm">{khoanThus.length + 1}</td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRow.maKhoanThu}
                        onChange={(e) => setNewRow(prev => ({ ...prev, maKhoanThu: e.target.value }))}
                        placeholder="Mã khoản thu"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRow.maDotThu}
                        onChange={(e) => setNewRow(prev => ({ ...prev, maDotThu: e.target.value }))}
                        placeholder="Mã đợt thu"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRow.maHoKhau}
                        onChange={(e) => setNewRow(prev => ({ ...prev, maHoKhau: e.target.value }))}
                        placeholder="Mã hộ khẩu"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRow.maLoaiKhoanThu}
                        onChange={(e) => setNewRow(prev => ({ ...prev, maLoaiKhoanThu: e.target.value }))}
                        placeholder="Mã loại khoản thu"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="number"
                        min="0"
                        value={newRow.soTienPhaiNop}
                        onChange={(e) => setNewRow(prev => ({ ...prev, soTienPhaiNop: e.target.value }))}
                        placeholder="Số tiền"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="date"
                        value={newRow.ngayNop}
                        onChange={(e) => setNewRow(prev => ({ ...prev, ngayNop: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <select
                        value={newRow.trangThaiThanhToan}
                        onChange={(e) => setNewRow(prev => ({ ...prev, trangThaiThanhToan: e.target.value as "Đã thanh toán" | "Chưa thanh toán" }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Đã thanh toán">Đã thanh toán</option>
                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveNew}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          title="Lưu"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancelNew}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                          title="Hủy"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {filteredKhoanThus.map((khoanThu) => (
                  <tr key={khoanThu.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-300 text-sm">{khoanThu.id}</td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <input
                          type="text"
                          value={editingRow.maKhoanThu}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, maKhoanThu: e.target.value }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        khoanThu.maKhoanThu
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <input
                          type="text"
                          value={editingRow.maDotThu}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, maDotThu: e.target.value }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        khoanThu.maDotThu
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <input
                          type="text"
                          value={editingRow.maHoKhau}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, maHoKhau: e.target.value }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        khoanThu.maHoKhau
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <input
                          type="text"
                          value={editingRow.maLoaiKhoanThu}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, maLoaiKhoanThu: e.target.value }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        khoanThu.maLoaiKhoanThu
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editingRow.soTienPhaiNop}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, soTienPhaiNop: e.target.value }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        khoanThu.soTienPhaiNop.toLocaleString()
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <input
                          type="date"
                          value={editingRow.ngayNop}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, ngayNop: e.target.value }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        khoanThu.ngayNop
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-sm">
                      {editingRow?.id === khoanThu.id ? (
                        <select
                          value={editingRow.trangThaiThanhToan}
                          onChange={(e) => setEditingRow(prev => prev ? ({ ...prev, trangThaiThanhToan: e.target.value as "Đã thanh toán" | "Chưa thanh toán" }) : null)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="Đã thanh toán">Đã thanh toán</option>
                          <option value="Chưa thanh toán">Chưa thanh toán</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          khoanThu.trangThaiThanhToan === "Đã thanh toán" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {khoanThu.trangThaiThanhToan}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <div className="flex gap-2">
                        
                        {editingRow?.id === khoanThu.id ? (
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Lưu"
                          >
                            <FaSave />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(khoanThu)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <FaPen />
                          </button>
                        )}
                        {editingRow?.id === khoanThu.id ? (
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            title="Hủy"
                          >
                            <FaTimes />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(khoanThu.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Hiển thị</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">mục</span>
            </div>
            <div className="text-sm text-gray-700">
              Tổng cộng: {filteredKhoanThus.length} kết quả
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}