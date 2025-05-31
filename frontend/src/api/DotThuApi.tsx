import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/dotthu';

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

export interface DotThu {
  maDotThu?: number;
  tenDotThu: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: string;
}

export function fetchAllDotThu() {
  return axios.get<DotThu[]>(API_BASE_URL);
}

export function fetchDotThuById(id: number) {
  return axios.get<DotThu>(`${API_BASE_URL}/${id}`);
}

export function createDotThu(data: DotThu) {
  console.log('Creating DotThu:', data);
  return axios.post<DotThu>(API_BASE_URL, data).catch(err => {
    console.error('Create DotThu error:', err.response?.data || err.message);
    throw err;
  });
}

export function updateDotThu(id: number, data: DotThu) {
  console.log('Updating DotThu ID:', id, 'Data:', data);
  return axios.put<DotThu>(`${API_BASE_URL}/${id}`, data).catch(err => {
    console.error('Update DotThu error:', err.response?.data || err.message);
    throw err;
  });
}

export function deleteDotThu(id: number) {
  console.log('Deleting DotThu ID:', id);
  return axios.delete(`${API_BASE_URL}/${id}`).catch(err => {
    console.error('Delete DotThu error:', err.response?.data || err.message);
    throw err;
  });
}