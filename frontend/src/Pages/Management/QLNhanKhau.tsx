import React, { useState } from "react";
import { FaSearch, FaPlus, FaPen, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";
import MainLayout from "../../Layout/MainLayout";

interface TemporaryRecord {
  id: number;
  code: string;
  personId: string;
  type: 'tamtru' | 'tamvang';
  fromDate: string;
  toDate: string;
  location: string;
  isEditing?: boolean;
}

export default function QLNhanKhau() {
  const [records, setRecords] = useState<TemporaryRecord[]>([
    {
      id: 1,
      code: "TTR001",
      personId: "NK001",
      type: "tamtru",
      fromDate: "01/05/2022",
      toDate: "01/05/2023",
      location: "Hà Nội"
    }
  ]);

  const [searchCriteria, setSearchCriteria] = useState("0");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const [newRecord, setNewRecord] = useState<Partial<TemporaryRecord>>({
    code: "",
    personId: "",
    type: "tamtru",
    fromDate: "",
    toDate: "",
    location: ""
  });

  // Format date functions
  const formatDateISO = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
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

  // Search function
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }

    const criteriaMap = ['code', 'personId', 'type', 'fromDate', 'toDate', 'location'];
    const searchField = criteriaMap[parseInt(searchCriteria)];
    
    const foundRecord = records.find(record => {
      const fieldValue = record[searchField as keyof TemporaryRecord]?.toString().toLowerCase();
      return fieldValue?.includes(searchKeyword.toLowerCase());
    });

    if (foundRecord) {
      setHighlightedId(foundRecord.id);
      setTimeout(() => setHighlightedId(null), 3000);
    } else {
      alert('Không tìm thấy bản ghi phù hợp.');
    }
  };

  // Add new record
  const handleAddNew = () => {
    setIsAdding(true);
    setNewRecord({
      code: "",
      personId: "",
      type: "tamtru",
      fromDate: "",
      toDate: "",
      location: ""
    });
  };

  const handleSaveNew = () => {
    if (!newRecord.code?.trim() || !newRecord.personId?.trim()) {
      alert('Vui lòng nhập đầy đủ mã tạm trú và mã nhân khẩu.');
      return;
    }

    const maxId = Math.max(...records.map(r => r.id), 0);
    const recordToAdd: TemporaryRecord = {
      id: maxId + 1,
      code: newRecord.code!,
      personId: newRecord.personId!,
      type: newRecord.type!,
      fromDate: newRecord.fromDate ? formatDateDisplay(newRecord.fromDate) : "",
      toDate: newRecord.toDate ? formatDateDisplay(newRecord.toDate) : "",
      location: newRecord.location || ""
    };

    setRecords([...records, recordToAdd]);
    setIsAdding(false);
  };

  const handleCancelNew = () => {
    setIsAdding(false);
    setNewRecord({});
  };

  // Edit record
  const handleEdit = (id: number) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { ...record, isEditing: !record.isEditing }
        : record
    ));
  };

  const handleSaveEdit = (id: number, updatedData: Partial<TemporaryRecord>) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { 
            ...record, 
            ...updatedData,
            isEditing: false,
            fromDate: updatedData.fromDate ? formatDateDisplay(updatedData.fromDate) : record.fromDate,
            toDate: updatedData.toDate ? formatDateDisplay(updatedData.toDate) : record.toDate
          }
        : record
    ));
  };

  // Delete record
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      setRecords(records.filter(record => record.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Quản lí tạm trú tạm vắng</h2>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Mã tạm trú tạm vắng</option>
                <option value="1">Mã nhân khẩu</option>
                <option value="2">Loại</option>
                <option value="3">Từ ngày</option>
                <option value="4">Đến ngày</option>
                <option value="5">Nơi tạm trú/ tạm vắng</option>
              </select>
              
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              
              <button
                onClick={handleSearch}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">
                  <FaSearch />
                </span>
                Tìm kiếm
              </button>
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <span className="mr-2">
                <FaPlus />
              </span>
              Tạo mới
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Mã tạm trú tạm vắng
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Mã nhân khẩu
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Từ ngày
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Đến ngày
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Nơi tạm trú/ tạm vắng
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border border-gray-300">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* New Record Row */}
                {isAdding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRecord.code || ""}
                        onChange={(e) => setNewRecord({...newRecord, code: e.target.value})}
                        placeholder="Mã tạm trú tạm vắng"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRecord.personId || ""}
                        onChange={(e) => setNewRecord({...newRecord, personId: e.target.value})}
                        placeholder="Mã nhân khẩu"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <select
                        value={newRecord.type || "tamtru"}
                        onChange={(e) => setNewRecord({...newRecord, type: e.target.value as 'tamtru' | 'tamvang'})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="tamtru">Tạm trú</option>
                        <option value="tamvang">Tạm vắng</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="date"
                        value={newRecord.fromDate || ""}
                        onChange={(e) => setNewRecord({...newRecord, fromDate: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="date"
                        value={newRecord.toDate || ""}
                        onChange={(e) => setNewRecord({...newRecord, toDate: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        value={newRecord.location || ""}
                        onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                        placeholder="Nơi tạm trú/tạm vắng"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveNew}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          title="Lưu"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancelNew}
                          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          title="Hủy"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Existing Records */}
                {records.map((record) => (
                  <EditableRow
                    key={record.id}
                    record={record}
                    isHighlighted={highlightedId === record.id}
                    onEdit={handleEdit}
                    onSave={handleSaveEdit}
                    onDelete={handleDelete}
                    formatDateISO={formatDateISO}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">
                Hiển thị
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  className="mx-2 px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                mục
              </label>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Editable Row Component
interface EditableRowProps {
  record: TemporaryRecord;
  isHighlighted: boolean;
  onEdit: (id: number) => void;
  onSave: (id: number, data: Partial<TemporaryRecord>) => void;
  onDelete: (id: number) => void;
  formatDateISO: (date: string) => string;
}

function EditableRow({ record, isHighlighted, onEdit, onSave, onDelete, formatDateISO }: EditableRowProps) {
  const [editData, setEditData] = useState<Partial<TemporaryRecord>>({});

  const handleSave = () => {
    onSave(record.id, editData);
    setEditData({});
  };

  const handleCancel = () => {
    onEdit(record.id);
    setEditData({});
  };

  return (
    <tr className={`${isHighlighted ? 'bg-yellow-200' : 'hover:bg-gray-50'} transition-colors`}>
      <td className="px-4 py-3 border border-gray-300">
        {record.isEditing ? (
          <input
            type="text"
            value={editData.code !== undefined ? editData.code : record.code}
            onChange={(e) => setEditData({...editData, code: e.target.value})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          record.code
        )}
      </td>
      <td className="px-4 py-3 border border-gray-300">
        {record.isEditing ? (
          <input
            type="text"
            value={editData.personId !== undefined ? editData.personId : record.personId}
            onChange={(e) => setEditData({...editData, personId: e.target.value})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          record.personId
        )}
      </td>
      <td className="px-4 py-3 border border-gray-300">
        {record.isEditing ? (
          <select
            value={editData.type !== undefined ? editData.type : record.type}
            onChange={(e) => setEditData({...editData, type: e.target.value as 'tamtru' | 'tamvang'})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          >
            <option value="tamtru">Tạm trú</option>
            <option value="tamvang">Tạm vắng</option>
          </select>
        ) : (
          record.type === 'tamtru' ? 'Tạm trú' : 'Tạm vắng'
        )}
      </td>
      <td className="px-4 py-3 border border-gray-300">
        {record.isEditing ? (
          <input
            type="date"
            value={editData.fromDate !== undefined ? formatDateISO(editData.fromDate) : formatDateISO(record.fromDate)}
            onChange={(e) => setEditData({...editData, fromDate: e.target.value})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          record.fromDate
        )}
      </td>
      <td className="px-4 py-3 border border-gray-300">
        {record.isEditing ? (
          <input
            type="date"
            value={editData.toDate !== undefined ? formatDateISO(editData.toDate) : formatDateISO(record.toDate)}
            onChange={(e) => setEditData({...editData, toDate: e.target.value})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          record.toDate
        )}
      </td>
      <td className="px-4 py-3 border border-gray-300">
        {record.isEditing ? (
          <input
            type="text"
            value={editData.location !== undefined ? editData.location : record.location}
            onChange={(e) => setEditData({...editData, location: e.target.value})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          record.location
        )}
      </td>
      <td className="px-4 py-3 border border-gray-300">
        <div className="flex space-x-2">
          {record.isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                title="Lưu"
              >
                <FaSave />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                title="Hủy"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(record.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Sửa"
              >
                <FaPen />
              </button>
              <button
                onClick={() => onDelete(record.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Xóa"
              >
                <FaTrashAlt />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}