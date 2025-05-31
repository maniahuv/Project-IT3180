import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/nopphi";

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

  export interface NopPhi {
    id?: number;
    ngayThu?: string;
    soTien?: number;
    nguoiNop?: string;
    idNguoiThu?: number;
    maHoKhau?: number;
    maKhoanThu?: number;
    nguoiThu?: { id: number };
    hoKhau?: { maHoKhau: number };
    khoanThu?: { maKhoanThu: number };
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