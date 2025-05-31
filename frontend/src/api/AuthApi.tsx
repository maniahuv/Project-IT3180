import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export interface TaiKhoan {
  id: number;
  username: string;
  password?: string;
  vaiTro?: number; // 1 = totruong, 2 = topho, 3 = ketoan
  hoTen: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  vaiTro: number;
  hoTen: string;
  message: string;
}

export function signup(data: TaiKhoan) {
  return axios.post<TaiKhoan>(`${API_BASE_URL}/signup`, data);
}

export function login(credentials: LoginCredentials) {
  return axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
}