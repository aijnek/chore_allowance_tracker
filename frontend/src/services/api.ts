import axios, { AxiosError } from 'axios';
import { Allowance, ApiError, ApiResponse, Child, Chore, ChoreRecord } from '../types';

// Replace with your actual API Gateway URL when deployed
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
  }
  throw new Error('An unexpected error occurred');
};

// Chores API
export const getChores = async (): Promise<Chore[]> => {
  try {
    const response = await api.get<ApiResponse<Chore[]>>('/chores');
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getChore = async (id: string): Promise<Chore> => {
  try {
    const response = await api.get<ApiResponse<Chore>>(`/chores/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createChore = async (chore: Pick<Chore, 'name' | 'price'>): Promise<Chore> => {
  try {
    const response = await api.post<ApiResponse<Chore>>('/chores', chore);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateChore = async (id: string, chore: Pick<Chore, 'name' | 'price'>): Promise<Chore> => {
  try {
    const response = await api.put<ApiResponse<Chore>>(`/chores/${id}`, chore);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteChore = async (id: string): Promise<{ id: string; deleted: boolean }> => {
  try {
    const response = await api.delete<ApiResponse<{ id: string; deleted: boolean }>>(`/chores/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// Children API
export const getChildren = async (): Promise<Child[]> => {
  try {
    const response = await api.get<ApiResponse<Child[]>>('/children');
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getChild = async (id: string): Promise<Child> => {
  try {
    const response = await api.get<ApiResponse<Child>>(`/children/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createChild = async (child: Pick<Child, 'name'>): Promise<Child> => {
  try {
    const response = await api.post<ApiResponse<Child>>('/children', child);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateChild = async (id: string, child: Pick<Child, 'name'>): Promise<Child> => {
  try {
    const response = await api.put<ApiResponse<Child>>(`/children/${id}`, child);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteChild = async (id: string): Promise<{ id: string; deleted: boolean }> => {
  try {
    const response = await api.delete<ApiResponse<{ id: string; deleted: boolean }>>(`/children/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// Records API
export const getRecords = async (): Promise<ChoreRecord[]> => {
  try {
    const response = await api.get<ApiResponse<ChoreRecord[]>>('/records');
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getRecord = async (id: string): Promise<ChoreRecord> => {
  try {
    const response = await api.get<ApiResponse<ChoreRecord>>(`/records/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createRecord = async (record: Pick<ChoreRecord, 'choreId' | 'childId' | 'date'>): Promise<ChoreRecord> => {
  try {
    const response = await api.post<ApiResponse<ChoreRecord>>('/records', record);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateRecord = async (id: string, record: Pick<ChoreRecord, 'choreId' | 'childId' | 'date'>): Promise<ChoreRecord> => {
  try {
    const response = await api.put<ApiResponse<ChoreRecord>>(`/records/${id}`, record);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteRecord = async (id: string): Promise<{ id: string; deleted: boolean }> => {
  try {
    const response = await api.delete<ApiResponse<{ id: string; deleted: boolean }>>(`/records/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// Allowances API
export const getAllowances = async (month: string, year: number): Promise<Allowance[]> => {
  try {
    const response = await api.get<ApiResponse<Allowance[]>>(`/allowances?month=${month}&year=${year}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};
