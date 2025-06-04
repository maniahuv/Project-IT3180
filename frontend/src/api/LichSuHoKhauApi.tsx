import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/lichsuhokhau";

axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export interface LichSuHoKhau {
  maLichSu?: number;
  loaiThayDoi: number; // 1 = add to household, 2 = remove from household
  thoiGian: string; // LocalDateTime serialized as string (e.g., "YYYY-MM-DDTHH:mm:ss")
  maHoKhau?: number; // Reference to HoKhau entity
  maNhanKhau?: number; // Optional, as it may be null
  hoKhau: { maHoKhau: number }; // Simplified reference to HoKhau entity
  nhanKhau?: { maNhanKhau: number }; // Optional, as it may be null
}

export function fetchAllLichSuHoKhau() {
  return axios.get<LichSuHoKhau[]>(API_BASE_URL);
}

export function fetchLichSuHoKhauById(id: number) {
  return axios.get<LichSuHoKhau>(`${API_BASE_URL}/${id}`);
}

// export function createLichSuHoKhau(data: LichSuHoKhau) {
//   return axios.post<LichSuHoKhau>(API_BASE_URL, data);
// }

// export function updateLichSuHoKhau(id: number, data: LichSuHoKhau) {
//   return axios.put<LichSuHoKhau>(`${API_BASE_URL}/${id}`, data);
// }

// export function deleteLichSuHoKhau(id: number) {
//   return axios.delete(`${API_BASE_URL}/${id}`);
// }