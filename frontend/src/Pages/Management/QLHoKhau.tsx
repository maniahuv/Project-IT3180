import React, { useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import {
  FaSearch,
  FaPlus,
  FaPen,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";

interface Household {
  id: number;
  code: string;
  apartmentNumber: string;
  area: number;
  memberCount: number;
  householdHead: string;
}

interface NewHousehold {
  id: string;
  code: string;
  apartmentNumber: string;
  area: string;
  memberCount: string;
  householdHead: string;
}

export default function QLHoKhau() {
  const [searchCriteria, setSearchCriteria] = useState("mahokhau");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHousehold, setNewHousehold] = useState<NewHousehold>({
    id: "",
    code: "",
    apartmentNumber: "",
    area: "",
    memberCount: "",
    householdHead: "",
  });

  const [households, setHouseholds] = useState<Household[]>([
    {
      id: 1,
      code: "HK001",
      apartmentNumber: "101",
      area: 75.5,
      memberCount: 4,
      householdHead: "Nguyễn Văn A",
    },
    {
      id: 2,
      code: "HK002",
      apartmentNumber: "102",
      area: 82.0,
      memberCount: 3,
      householdHead: "Trần Thị B",
    },
    {
      id: 3,
      code: "HK003",
      apartmentNumber: "201",
      area: 95.5,
      memberCount: 5,
      householdHead: "Lê Văn C",
    },
  ]);

  const [editingData, setEditingData] = useState<Household | null>(null);

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for:", searchKeyword, "in", searchCriteria);
  };
//   const handleAddNew = () => {
//     if (isAdding) return;
  
//     // Lấy id lớn nhất hiện tại và tự động tăng
//     const nextId =
//       dotThuList.length > 0
//         ? (Math.max(...dotThuList.map(item => parseInt(item.id))) + 1).toString()
//         : "1";
  
//     setIsAdding(true);
//     setNewDotThu({
//       id: nextId, // ID được tự động gán, không cho phép chỉnh sửa
//       maDotThu: "",
//       thoiGianBatDau: "",
//       thoiGianKetThuc: "",
//       moTa: "",
//       trangThai: ""
//     });
//   };

  const handleAddNew = () => {
    if (isAddingNew) return;
        // Lấy id lớn nhất hiện tại và tự động tăng
    const nextId =
      households.length > 0
        ? (Math.max(...households.map(item => item.id)) + 1).toString()
        : "1";
    setIsAddingNew(true);
    setNewHousehold({
      id: nextId,
      code: "",
      apartmentNumber: "",
      area: "",
      memberCount: "",
      householdHead: "",
    });
  };

  const handleSaveNew = () => {
    // Validate inputs
    if (
      !newHousehold.id.trim() ||
      !newHousehold.code.trim() ||
      !newHousehold.apartmentNumber.trim() ||
      !newHousehold.area.trim() ||
      !newHousehold.memberCount.trim() ||
      !newHousehold.householdHead.trim()
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const area = parseFloat(newHousehold.area);
    const memberCount = parseInt(newHousehold.memberCount, 10);

    if (isNaN(area) || area <= 0) {
      alert("Diện tích phải là số lớn hơn 0.");
      return;
    }

    if (isNaN(memberCount) || memberCount <= 0) {
      alert("Số người phải là số nguyên lớn hơn 0.");
      return;
    }

    const newId = Math.max(...households.map(h => h.id)) + 1;
    const household: Household = {
      id: newId,
      code: newHousehold.code,
      apartmentNumber: newHousehold.apartmentNumber,
      area: area,
      memberCount: memberCount,
      householdHead: newHousehold.householdHead,
    };

    setHouseholds([...households, household]);
    setIsAddingNew(false);
    setNewHousehold({
      id: "",
      code: "",
      apartmentNumber: "",
      area: "",
      memberCount: "",
      householdHead: "",
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewHousehold({
      id: "",
      code: "",
      apartmentNumber: "",
      area: "",
      memberCount: "",
      householdHead: "",
    });
  };

  const handleEdit = (household: Household) => {
    if (editingRow === household.id) {
      // Save editing
      if (editingData) {
        setHouseholds(
          households.map(h => (h.id === household.id ? editingData : h))
        );
      }
      setEditingRow(null);
      setEditingData(null);
    } else {
      // Start editing
      setEditingRow(household.id);
      setEditingData({ ...household });
    }
  };

  const handleDelete = (id: number) => {
    const userConfirmed = window.confirm("Bạn có chắc muốn xóa hộ khẩu này?");
    if (!userConfirmed) return;
    setHouseholds(households.filter(h => h.id !== id));
  };

  const handleEditingDataChange = (field: keyof Household, value: string) => {
    if (!editingData) return;
    
    let processedValue: any = value;
    if (field === 'area') {
      processedValue = parseFloat(value) || 0;
    } else if (field === 'memberCount' || field === 'id') {
      processedValue = parseInt(value, 10) || 0;
    }

    setEditingData({
      ...editingData,
      [field]: processedValue,
    });
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý hộ khẩu</h2>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mahokhau">Mã hộ khẩu</option>
                <option value="socanho">Số căn hộ</option>
                <option value="chuho">Chủ hộ</option>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
              >
                <FaSearch />
                <span>Tìm kiếm</span>
              </button>
            </div>

            <button
              onClick={handleAddNew}
              disabled={isAddingNew}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2 transition-colors"
            >
              <FaPlus />
              <span>Tạo mới</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Mã hộ khẩu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Số căn hộ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Diện tích (m²)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Số người
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Chủ hộ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* New row for adding */}
              {isAddingNew && (
                <tr className="bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap">
              {    newHousehold.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      placeholder="Mã hộ khẩu"
                      value={newHousehold.code}
                      onChange={(e) =>
                        setNewHousehold({ ...newHousehold, code: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      placeholder="Số căn hộ"
                      value={newHousehold.apartmentNumber}
                      onChange={(e) =>
                        setNewHousehold({ ...newHousehold, apartmentNumber: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      placeholder="Diện tích"
                      step="0.1"
                      min="0"
                      value={newHousehold.area}
                      onChange={(e) =>
                        setNewHousehold({ ...newHousehold, area: e.target.value })
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      placeholder="Số người"
                      min="1"
                      value={newHousehold.memberCount}
                      onChange={(e) =>
                        setNewHousehold({ ...newHousehold, memberCount: e.target.value })
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      placeholder="Chủ hộ"
                      value={newHousehold.householdHead}
                      onChange={(e) =>
                        setNewHousehold({ ...newHousehold, householdHead: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNew}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Lưu"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancelNew}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Hủy"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing rows */}
              {households.map((household) => (
                <tr key={household.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {    household.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingRow === household.id ? (
                      <input
                        type="text"
                        value={editingData?.code || ''}
                        onChange={(e) => handleEditingDataChange('code', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      household.code
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingRow === household.id ? (
                      <input
                        type="text"
                        value={editingData?.apartmentNumber || ''}
                        onChange={(e) => handleEditingDataChange('apartmentNumber', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      household.apartmentNumber
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingRow === household.id ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editingData?.area || ''}
                        onChange={(e) => handleEditingDataChange('area', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      household.area.toFixed(1)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingRow === household.id ? (
                      <input
                        type="number"
                        value={editingData?.memberCount || ''}
                        onChange={(e) => handleEditingDataChange('memberCount', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      household.memberCount
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingRow === household.id ? (
                      <input
                        type="text"
                        value={editingData?.householdHead || ''}
                        onChange={(e) => handleEditingDataChange('householdHead', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      household.householdHead
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                            <button
                                                  onClick={() => handleEdit(household)}
                                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                  title={editingRow === household.id ? "Lưu" : "Sửa"}
                                                >
                                                  {editingRow === household.id ? <FaSave /> : <FaPen />}
                                                </button>
                                                <button
                                                  onClick={() => handleDelete(household.id)}
                                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                  title="Xóa"
                                                >
                                                  <FaTrashAlt />
                                                </button>
                
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <label className="text-sm text-gray-700">
              Hiển thị{" "}
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="mx-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    </MainLayout>
  );
}