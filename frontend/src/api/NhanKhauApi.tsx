// src/api/nhanKhauApi.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/nhankhau";


export interface PersonRecord {
  id: number;
  personId: string;
  householdId: string;
  fullName: string;
  citizenId: string;
  birthDate?: string;
  gender: string;
  occupation?: string;
  relationship?: string;
  residenceStatus?: string;
}

export type PersonRecordWithoutId = Omit<PersonRecord, "id">;

export function fetchAllNhanKhau() {
  return axios.get<PersonRecord[]>(API_BASE_URL);
}

export function createNhanKhau(data: PersonRecordWithoutId) {
  return axios.post<PersonRecord>(API_BASE_URL, data);
}

export function updateNhanKhau(id: number, data: PersonRecordWithoutId) {
  return axios.put(`${API_BASE_URL}/${id}`, data);
}

export function deleteNhanKhau(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}
