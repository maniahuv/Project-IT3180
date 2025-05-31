import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/nhankhau";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

export interface NhanKhau {
  maNhanKhau?: number;
  hoTen: string;
  ngaySinh: string; // LocalDate serialized as "YYYY-MM-DD"
  gioiTinh: boolean; // true = male, false = female
  cmnd?: string;
  qhVoiChuHo?: string;
  trangThai?: string;
  maHoKhau?: number; // Direct reference to HoKhau's maHoKhau
}

export function fetchAllNhanKhau() {
  return axios.get<NhanKhau[]>(API_BASE_URL, {
    headers: {
      Accept: 'application/json'
    }
  });
}

export function fetchNhanKhauById(id: number) {
  return axios.get<NhanKhau>(`${API_BASE_URL}/${id}`, {
    headers: {
      Accept: 'application/json'
    }
  });
}

export function createNhanKhau(data: NhanKhau) {
  return axios.post<NhanKhau>(API_BASE_URL, data, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

export function updateNhanKhau(id: number, data: NhanKhau) {
  return axios.put<NhanKhau>(`${API_BASE_URL}/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

export function deleteNhanKhau(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Accept: 'application/json'
    }
  });
}