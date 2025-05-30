import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/nopphi";

export interface NopPhi {
  id: number;
  ngayThu?: string; // LocalDate serialized as string (e.g., "YYYY-MM-DD")
  soTien?: number; // Using number for Float in TypeScript
  nguoiNop?: string; // Optional, as it may be null
  nguoiThu: { id: number }; // Simplified reference to TaiKhoan entity
  hoKhau: { maHoKhau: number }; // Simplified reference to HoKhau entity
  khoanThuDotThu: { idKhoanThuDotThu: number }; // Simplified reference to KhoanThuDotThu entity
}

export function fetchAllNopPhi() {
  return axios.get<NopPhi[]>(API_BASE_URL);
}

export function fetchNopPhiById(id: number) {
  return axios.get<NopPhi>(`${API_BASE_URL}/${id}`);
}

export function createNopPhi(data: NopPhi) {
  return axios.post<NopPhi>(API_BASE_URL, data);
}

export function updateNopPhi(id: number, data: NopPhi) {
  return axios.put<NopPhi>(`${API_BASE_URL}/${id}`, data);
}

export function deleteNopPhi(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}