import React, { useEffect, useState } from "react";

interface Column {
  field: string;
  label: string;
  required?: boolean;
  type?: "text" | "number" | "date";
}

interface TableConfig {
  columns: Column[];
  idField: string;
  title: string;
}

interface ReusableTableProps {
  config: TableConfig;
  fetchFunction: () => Promise<any>;
  createFunction: (item: any) => Promise<any>;
  updateFunction: (id: number, item: any) => Promise<any>;
  deleteFunction: (id: number) => Promise<any>;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  config,
  fetchFunction,
  createFunction,
  updateFunction,
  deleteFunction,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<any>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchFunction();
      setData(response.data || response);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateItem = (item: any) => {
    const validationErrors: { [key: string]: string } = {};
    config.columns.forEach((col) => {
      if (col.required && !item[col.field]) {
        validationErrors[col.field] = "Không được bỏ trống";
      }
    });
    return validationErrors;
  };

  const handleInputChange = (field: string, value: any, isEditing = false) => {
    if (isEditing) {
      setEditingData((prev: any) => ({ ...prev, [field]: value }));
    } else {
      setNewItem((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveNew = async () => {
    const validationErrors = validateItem(newItem);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createFunction(newItem);
      setNewItem({});
      setErrors({});
      fetchData();
    } catch (error) {
      console.error("Create error:", error);
      alert("Lỗi khi tạo mới");
    }
  };

  const handleEdit = async (item: any) => {
    const id = item[config.idField];

    if (editingId === id) {
      const validationErrors = validateItem(editingData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        await updateFunction(Number(id), editingData);
        setEditingId(null);
        setEditingData({});
        setErrors({});
        fetchData();
      } catch (error) {
        console.error("Update error:", error);
        alert("Lỗi khi cập nhật");
      }
    } else {
      setEditingId(id);
      setEditingData(item);
      setErrors({});
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Bạn có chắc muốn xóa mục này?")) return;
    try {
      await deleteFunction(Number(id));
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Lỗi khi xóa");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{config.title}</h2>

      {/* Bảng */}
      <table className="w-full border border-gray-300 mb-4">
        <thead>
          <tr>
            {config.columns.map((col) => (
              <th key={col.field} className="border px-2 py-1">
                {col.label}
              </th>
            ))}
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Dòng thêm mới */}
          <tr>
            {config.columns.map((col) => (
              <td key={col.field} className="border px-2 py-1">
                <input
                  type={col.type || "text"}
                  value={newItem[col.field] || ""}
                  onChange={(e) =>
                    handleInputChange(col.field, e.target.value)
                  }
                  className="w-full border rounded px-1 py-0.5"
                />
                {errors[col.field] && (
                  <div className="text-red-500 text-sm">
                    {errors[col.field]}
                  </div>
                )}
              </td>
            ))}
            <td className="border px-2 py-1">
              <button
                onClick={handleSaveNew}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Thêm
              </button>
            </td>
          </tr>

          {/* Dữ liệu */}
          {data.map((item) => {
            const id = item[config.idField];
            const isEditing = editingId === id;
            return (
              <tr key={id}>
                {config.columns.map((col) => (
                  <td key={col.field} className="border px-2 py-1">
                    {isEditing ? (
                      <>
                        <input
                          type={col.type || "text"}
                          value={editingData[col.field] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              col.field,
                              e.target.value,
                              true
                            )
                          }
                          className="w-full border rounded px-1 py-0.5"
                        />
                        {errors[col.field] && (
                          <div className="text-red-500 text-sm">
                            {errors[col.field]}
                          </div>
                        )}
                      </>
                    ) : (
                      item[col.field]
                    )}
                  </td>
                ))}
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    {isEditing ? "Lưu" : "Sửa"}
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {loading && <div>Đang tải dữ liệu...</div>}
    </div>
  );
};

export default ReusableTable;
export type { TableConfig, Column };