import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/khoanthu";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// export interface KhoanThu {
//   maKhoanThu?: number;
//   tenKhoanThu: string;
//   loaiKhoanThu?: string;
//   soTien?: number;
//   batBuoc: boolean;
//   ghiChu?: string;
//   dotThu?: { maDotThu: number };
// }

export interface KhoanThu {
    maKhoanThu?: number;
    tenKhoanThu: string;
    loaiKhoanThu?: string;
    soTien?: number;
    batBuoc: boolean;
    ghiChu?: string;
    maDotThu?: number; // Add maDotThu field
    dotThu?: { maDotThu: number; tenDotThu?: string }; // Keep for create/update
  }
export function fetchAllKhoanThu() {
  return axios.get<KhoanThu[]>(API_BASE_URL);
}

export function fetchKhoanThuById(id: number) {
  return axios.get<KhoanThu>(`${API_BASE_URL}/${id}`);
}

export function createKhoanThu(data: KhoanThu) {
  console.log('Creating KhoanThu:', data);
  return axios.post<KhoanThu>(API_BASE_URL, data).catch(err => {
    console.error('Create KhoanThu error:', err.response?.data || err.message);
    throw err;
  });
}

export function updateKhoanThu(id: number, data: KhoanThu) {
  console.log('Updating KhoanThu ID:', id, 'Data:', data);
  return axios.put<KhoanThu>(`${API_BASE_URL}/${id}`, data).catch(err => {
    console.error('Update KhoanThu error:', err.response?.data || err.message);
    throw err;
  });
}

export function deleteKhoanThu(id: number) {
  console.log('Deleting KhoanThu ID:', id);
  return axios.delete(`${API_BASE_URL}/${id}`).catch(err => {
    console.error('Delete KhoanThu error:', err.response?.data || err.message);
    throw err;
  });
}