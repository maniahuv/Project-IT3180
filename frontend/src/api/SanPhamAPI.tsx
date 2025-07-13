import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/sanpham';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

// Interface cho SanPham
export interface SanPham {
  idSp?:string
  ten: string;
  ngayNhapHang?: string;
  donGiaGoc: number;
  giaBan: number;
  tonKho: number;
  daBan: number;
  moTa?: string;
}

// Lấy danh sách tất cả sản phẩm
export async function fetchAllSanPham(): Promise<{ data: SanPham[] }> {
  try {
    return await axios.get<SanPham[]>(API_BASE_URL);
  } catch (err: any) {
    // Nếu 401 thì trả về mảng rỗng, không throw → không bị redirect
    if (err.response?.status === 401) {
      console.warn('401 Unauthorized khi fetchAllSanPham, trả về mảng rỗng');
      return { data: [] };
    }
    console.error('Fetch all SanPham error:', err.response?.data || err.message);
    throw err;
  }
}

// Lấy sản phẩm theo ID
export function fetchSanPhamById(id: string) {
  return axios.get<SanPham>(`${API_BASE_URL}/${id}`).catch(err => {
    console.error(`Fetch SanPham ID ${id} error:`, err.response?.data || err.message);
    throw err;
  });
}

// Tính lợi nhuận của sản phẩm theo ID
export async function tinhLoiNhuan(id: string): Promise<{ data: number }> {
  try {
    return await axios.get<number>(`${API_BASE_URL}/${id}/loinhuan`);
  } catch (err: any) {
    // Nếu 401 thì trả về 0, không throw → không bị redirect
    if (err.response?.status === 401) {
      console.warn(`401 Unauthorized khi tinhLoiNhuan(${id}), trả về 0`);
      return { data: 0 };
    }
    console.error(`Tính lợi nhuận SanPham ID ${id} error:`, err.response?.data || err.message);
    throw err;
  }
}

// Tạo sản phẩm mới
export function createSanPham(data: SanPham) {
  console.log('Creating SanPham:', data);
  return axios.post<SanPham>(API_BASE_URL, data).catch(err => {
    console.error('Create SanPham error:', err.response?.data || err.message);
    throw err;
  });
}

// Cập nhật sản phẩm
export function updateSanPham(id: string, data: SanPham) {
  console.log('Updating SanPham ID:', id, 'Data:', data);
  return axios.put<SanPham>(`${API_BASE_URL}/${id}`, data).catch(err => {
    console.error(`Update SanPham ID ${id} error:`, err.response?.data || err.message);
    throw err;
  });
}

// Xóa sản phẩm
export function deleteSanPham(id: string) {
  console.log('Deleting SanPham ID:', id);
  return axios.delete(`${API_BASE_URL}/${id}`).catch(err => {
    console.error(`Delete SanPham ID ${id} error:`, err.response?.data || err.message);
    throw err;
  });
}
