import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export interface TaiKhoan {
  id: number;
  username: string;
  password?: string; // Password may not be returned in responses for security
  vaiTro?: number;
  hoTen: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export function signup(data: TaiKhoan) {
  return axios.post<TaiKhoan>(`${API_BASE_URL}/signup`, data);
}

export function login(credentials: LoginCredentials) {
  return axios.post<string>(`${API_BASE_URL}/login`, credentials);
}