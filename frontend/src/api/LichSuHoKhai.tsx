import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/lichsuhokhau";

export interface LichSuHoKhau {
  id: number;
  loaiThayDoi: number; // 1 = add to household, 2 = remove from household
  thoiGian: string; // LocalDateTime serialized as string (e.g., "YYYY-MM-DDTHH:mm:ss")
  hoKhau: { maHoKhau: number }; // Simplified reference to HoKhau entity
  nhanKhau?: { maNhanKhau: number }; // Optional, as it may be null
}

export function fetchAllLichSuHoKhau() {
  return axios.get<LichSuHoKhau[]>(API_BASE_URL);
}

export function fetchLichSuHoKhauById(id: number) {
  return axios.get<LichSuHoKhau>(`${API_BASE_URL}/${id}`);
}

export function createLichSuHoKhau(data: LichSuHoKhau) {
  return axios.post<LichSuHoKhau>(API_BASE_URL, data);
}

export function updateLichSuHoKhau(id: number, data: LichSuHoKhau) {
  return axios.put<LichSuHoKhau>(`${API_BASE_URL}/${id}`, data);
}

export function deleteLichSuHoKhau(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}