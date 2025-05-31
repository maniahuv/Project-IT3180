import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/hokhau";

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

export interface HoKhau {
  maHoKhau?: number;
  chuHo: number;
  soNha: string;
  ngayLap: string;
  ngayCapNhat?: string;
  dienTich: number;
  danhSachNhanKhau?: { maNhanKhau: number }[];
  lichSuHoKhau?: { maLichSu: number }[];
}

export function fetchAllHoKhau() {
  return axios.get<HoKhau[]>(API_BASE_URL, {
    headers: {
      Accept: 'application/json'
    }
  });
}

export function fetchHoKhauById(id: number) {
  return axios.get<HoKhau>(`${API_BASE_URL}/${id}`, {
    headers: {
      Accept: 'application/json'
    }
  });
}

export function createHoKhau(data: HoKhau, loaiThayDoi: number) {
  return axios.post<HoKhau>(API_BASE_URL, data, {
    params: {
      maNhanKhauChuHo: data.chuHo,
      loaiThayDoi
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

export function updateHoKhau(id: number, data: HoKhau, loaiThayDoi: number, maNhanKhauChuHo?: number) {
  return axios.put<HoKhau>(`${API_BASE_URL}/${id}`, data, {
    params: {
      loaiThayDoi,
      maNhanKhauChuHo
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

export function deleteHoKhau(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Accept: 'application/json'
    }
  });
}