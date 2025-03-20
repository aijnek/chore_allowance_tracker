import { ApiResponse, ErrorResponse, SuccessResponse } from './types';
import { DynamoDB } from 'aws-sdk';

export const dynamoDb = new DynamoDB.DocumentClient();

export const CHORES_TABLE = process.env.CHORES_TABLE || '';
export const RECORDS_TABLE = process.env.RECORDS_TABLE || '';
export const CHILDREN_TABLE = process.env.CHILDREN_TABLE || '';

export function createSuccessResponse<T>(data: T): ApiResponse<SuccessResponse<T>> {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ data }),
  };
}

export function createErrorResponse(statusCode: number, message: string): ApiResponse<ErrorResponse> {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message }),
  };
}

export function getMonthYearFromDate(dateString: string): { month: string; year: number } {
  const date = new Date(dateString);
  return {
    month: date.toLocaleString('default', { month: 'long' }),
    year: date.getFullYear(),
  };
}

export function getStartAndEndOfMonth(month: string, year: number): { start: string; end: string } {
  const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth();
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}
