// src/pages/NhanKhauPage.tsx
import React, { useEffect, useState } from "react";
import {
  fetchAllNhanKhau,
  createNhanKhau,
  updateNhanKhau,
  deleteNhanKhau,
  PersonRecord,
  PersonRecordWithoutId,
} from "../../api/NhanKhauApi";
import ReusableTable from "../../Component/ReusableTable";
import type { TableConfig } from "../../Component/ReusableTable";

export default function NhanKhauPage() {
  const [data, setData] = useState<PersonRecord[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetchAllNhanKhau();
      setData(response.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const config: TableConfig = {
    title: "Quản lý nhân khẩu",
    idField: "id",
    columns: [
      { field: "personId", label: "Mã nhân khẩu", required: true },
      { field: "householdId", label: "Mã hộ khẩu", required: true },
      { field: "fullName", label: "Họ tên", required: true },
      { field: "citizenId", label: "CCCD", required: true },
      { field: "birthDate", label: "Ngày sinh", type: "date" },
      { field: "gender", label: "Giới tính", required: true },
      { field: "occupation", label: "Nghề nghiệp" },
      { field: "relationship", label: "Quan hệ với chủ hộ" },
      { field: "residenceStatus", label: "Tình trạng cư trú" },
    ],
  };

  return (
    <ReusableTable
      config={config}
      data={data}
      onCreate={createNhanKhau}
      onUpdate={updateNhanKhau}
      onDelete={deleteNhanKhau}
      fetchData={fetchData}
    />
  );
}
