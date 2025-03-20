export interface Chore {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoreRecord {
  id: string;
  choreId: string;
  childId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoreRecordWithDetails extends ChoreRecord {
  choreName: string;
  childName: string;
  price: number;
}

export interface AllowanceRecord {
  choreId: string;
  choreName: string;
  price: number;
  count: number;
  subtotal: number;
}

export interface Allowance {
  childId: string;
  childName: string;
  month: string;
  year: number;
  amount: number;
  records: AllowanceRecord[];
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  message: string;
}
