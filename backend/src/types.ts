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

export interface Allowance {
  childId: string;
  childName: string;
  month: string;
  year: number;
  amount: number;
  records: {
    choreId: string;
    choreName: string;
    price: number;
    count: number;
    subtotal: number;
  }[];
}

export interface ApiResponse<T> {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  body: string;
}

export interface ErrorResponse {
  message: string;
}

export interface SuccessResponse<T> {
  data: T;
}
