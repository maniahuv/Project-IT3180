import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaPen, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";
import MainLayout from "../../Layout/MainLayout";

import { 
  TamTruTamVang, 
  fetchAllTamTruTamVang, 
  createTamTruTamVang, 
  updateTamTruTamVang, 
  deleteTamTruTamVang 
} from "../../api/TamTruTamVang";

export default function QLTamTruTamVang() {
  const [TamTruTamVangs, setTamTruTamVangs] = useState<TamTruTamVang[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchCriteria, setSearchCriteria] = useState("0");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const [newTamTruTamVang, setNewTamTruTamVang] = useState<Partial<TamTruTamVang>>({
    id: "",
    personId: "",
    type: "tamtru",
    fromDate: "",
    toDate: "",
    location: ""
  });

  // --- Format date helpers ---
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

  // --- Load data từ API khi component mount ---
  useEffect(() => {
    setLoading(true);
    fetchAllTamTruTamVang()
      .then(res => {
        setTamTruTamVangs(res.data.map(r => ({
          ...r,
          // convert ngày yyyy-MM-dd sang dd/MM/yyyy để hiển thị
          fromDate: formatDateDisplay(r.fromDate),
          toDate: formatDateDisplay(r.toDate),
        })));
        setLoading(false);
      })
      .catch(err => {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      });
  }, []);

  // --- Các hàm xử lý thêm sửa xóa gọi API ---
  const handleAddNew = () => {
    setIsAdding(true);
    setNewTamTruTamVang({
      id: "",
      personId: "",
      type: "tamtru",
      fromDate: "",
      toDate: "",
      location: ""
    });
  };

  const handleSaveNew = () => {
    if (!newTamTruTamVang.id?.trim() || !newTamTruTamVang.personId?.trim()) {
      alert('Vui lòng nhập đầy đủ mã tạm trú và mã nhân khẩu.');
      return;
    }
    // Chuẩn hóa ngày trước khi gửi
    const payload: TamTruTamVang = {
      id: newTamTruTamVang.id!,
      personId: newTamTruTamVang.personId!,
      type: newTamTruTamVang.type!,
      fromDate: formatDateISO(newTamTruTamVang.fromDate || ""),
      toDate: formatDateISO(newTamTruTamVang.toDate || ""),
      location: newTamTruTamVang.location || "",
    };

    createTamTruTamVang(payload)
      .then(res => {
        const added = res.data;
        // Hiển thị ngày dưới dạng dd/MM/yyyy
        added.fromDate = formatDateDisplay(added.fromDate);
        added.toDate = formatDateDisplay(added.toDate);
        setTamTruTamVangs([...TamTruTamVangs, added]);
        setIsAdding(false);
        setNewTamTruTamVang({});
      })
      .catch(err => {
        alert("Lỗi khi thêm bản ghi mới");
      });
  };

  const handleCancelNew = () => {
    setIsAdding(false);
    setNewTamTruTamVang({});
  };

  const handleEdit = (id: number) => {
    setTamTruTamVangs(TamTruTamVangs.map(TamTruTamVang =>
      TamTruTamVang.id === id ? { ...TamTruTamVang, isEditing: !TamTruTamVang.isEditing } : TamTruTamVang
    ));
  };

  const handleSaveEdit = (id: number, updatedData: Partial<TamTruTamVang>) => {
    // Lấy TamTruTamVang hiện tại
    const oldTamTruTamVang = TamTruTamVangs.find(r => r.id === id);
    if (!oldTamTruTamVang) return;

    // Chuẩn hóa ngày trước khi gửi
    const payload: TamTruTamVang = {
      id,
      id: updatedData.id ?? oldTamTruTamVang.id,
      personId: updatedData.personId ?? oldTamTruTamVang.personId,
      type: updatedData.type ?? oldTamTruTamVang.type,
      fromDate: updatedData.fromDate ? formatDateISO(updatedData.fromDate) : formatDateISO(oldTamTruTamVang.fromDate),
      toDate: updatedData.toDate ? formatDateISO(updatedData.toDate) : formatDateISO(oldTamTruTamVang.toDate),
      location: updatedData.location ?? oldTamTruTamVang.location,
    };

    updateTamTruTamVang(id, payload)
      .then(res => {
        const updated = res.data;
        updated.fromDate = formatDateDisplay(updated.fromDate);
        updated.toDate = formatDateDisplay(updated.toDate);
        setTamTruTamVangs(TamTruTamVangs.map(r =>
          r.id === id ? { ...updated, isEditing: false } : r
        ));
      })
      .catch(err => {
        alert("Lỗi khi cập nhật bản ghi");
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      deleteTamTruTamVang(id)
        .then(() => {
          setTamTruTamVangs(TamTruTamVangs.filter(TamTruTamVang => TamTruTamVang.id !== id));
        })
        .catch(() => alert("Lỗi khi xóa bản ghi"));
    }
  };

  // --- Hàm tìm kiếm giữ nguyên như bạn có ---
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }

    const criteriaMap = ['id', 'personId', 'type', 'fromDate', 'toDate', 'location'];
    const searchField = criteriaMap[parseInt(searchCriteria)];
    
    const foundTamTruTamVang = TamTruTamVangs.find(TamTruTamVang => {
      const fieldValue = TamTruTamVang[searchField as keyof TamTruTamVang]?.toString().toLowerCase();
      return fieldValue?.includes(searchKeyword.toLowerCase());
    });

    if (foundTamTruTamVang) {
      setHighlightedId(foundTamTruTamVang.id);
      setTimeout(() => setHighlightedId(null), 3000);
    } else {
      alert('Không tìm thấy bản ghi phù hợp.');
    }
  };

  // --- Phần render giữ nguyên như bạn đã làm ---

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
                className="px-3 py-2 border rounded"
              >
                <option value="0">Mã tạm trú</option>
                <option value="1">Mã nhân khẩu</option>
                <option value="2">Loại</option>
                <option value="3">Từ ngày</option>
                <option value="4">Đến ngày</option>
                <option value="5">Địa chỉ</option>
              </select>
              <input
                type="text"
                placeholder="Nhập từ khóa"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="text-white bg-blue-600 px-3 py-2 rounded"
              >
                <FaSearch />
              </button>
            </div>
            <div>
              <button
                onClick={handleAddNew}
                className="text-white bg-green-600 px-3 py-2 rounded flex items-center space-x-2"
              >
                <FaPlus /> <span>Thêm mới</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã tạm trú</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã nhân khẩu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Từ ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đến ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && <tr><td colSpan={7} className="text-center py-4">Đang tải dữ liệu...</td></tr>}

                {!loading && isAdding && (
                  <tr className="bg-green-50">
                    <td>
                      <input
                        type="text"
                        value={newTamTruTamVang.id}
                        onChange={e => setNewTamTruTamVang({ ...newTamTruTamVang, id: e.target.value })}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newTamTruTamVang.personId}
                        onChange={e => setNewTamTruTamVang({ ...newTamTruTamVang, personId: e.target.value })}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td>
                      <select
                        value={newTamTruTamVang.type}
                        onChange={e => setNewTamTruTamVang({ ...newTamTruTamVang, type: e.target.value as "tamtru" | "tamvang" })}
                        className="border px-2 py-1 w-full"
                      >
                        <option value="tamtru">Tạm trú</option>
                        <option value="tamvang">Tạm vắng</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={newTamTruTamVang.fromDate}
                        onChange={e => setNewTamTruTamVang({ ...newTamTruTamVang, fromDate: e.target.value })}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={newTamTruTamVang.toDate}
                        onChange={e => setNewTamTruTamVang({ ...newTamTruTamVang, toDate: e.target.value })}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newTamTruTamVang.location}
                        onChange={e => setNewTamTruTamVang({ ...newTamTruTamVang, location: e.target.value })}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="text-center space-x-2">
                      <button onClick={handleSaveNew} className="text-green-600">
                        <FaSave />
                      </button>
                      <button onClick={handleCancelNew} className="text-red-600">
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                )}

                {!loading && TamTruTamVangs.map(TamTruTamVang => (
                  <tr key={TamTruTamVang.id} className={highlightedId === TamTruTamVang.id ? "bg-yellow-100" : ""}>
                    {TamTruTamVang.isEditing ? (
                      <>
                        <td>
                          <input
                            type="text"
                            defaultValue={TamTruTamVang.id}
                            onChange={e => TamTruTamVang.id = e.target.value}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={TamTruTamVang.personId}
                            onChange={e => TamTruTamVang.personId = e.target.value}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td>
                          <select
                            defaultValue={TamTruTamVang.type}
                            onChange={e => TamTruTamVang.type = e.target.value as "tamtru" | "tamvang"}
                            className="border px-2 py-1 w-full"
                          >
                            <option value="tamtru">Tạm trú</option>
                            <option value="tamvang">Tạm vắng</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={TamTruTamVang.fromDate}
                            onChange={e => TamTruTamVang.fromDate = e.target.value}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={TamTruTamVang.toDate}
                            onChange={e => TamTruTamVang.toDate = e.target.value}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={TamTruTamVang.location}
                            onChange={e => TamTruTamVang.location = e.target.value}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="text-center space-x-2">
                          <button onClick={() => handleSaveEdit(TamTruTamVang.id!, TamTruTamVang)} className="text-green-600">
                            <FaSave />
                          </button>
                          <button onClick={() => handleEdit(TamTruTamVang.id!)} className="text-red-600">
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{TamTruTamVang.id}</td>
                        <td>{TamTruTamVang.personId}</td>
                        <td>{TamTruTamVang.type === "tamtru" ? "Tạm trú" : "Tạm vắng"}</td>
                        <td>{TamTruTamVang.fromDate}</td>
                        <td>{TamTruTamVang.toDate}</td>
                        <td>{TamTruTamVang.location}</td>
                        <td className="text-center space-x-2">
                          <button onClick={() => handleEdit(TamTruTamVang.id!)} className="text-blue-600">
                            <FaPen />
                          </button>
                          <button onClick={() => handleDelete(TamTruTamVang.id!)} className="text-red-600">
                            <FaTrashAlt />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {!loading && TamTruTamVangs.length === 0 && !isAdding && (
                  <tr><td colSpan={7} className="text-center py-4">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
