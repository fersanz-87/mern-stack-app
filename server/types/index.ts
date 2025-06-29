import { Document } from 'mongoose';

// User interface
export interface IUser {
  name: string;
  email: string;
  address: string;
}

// User document interface (includes MongoDB document methods)
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationData;
}

// Request interfaces
export interface CreateUserRequest {
  name: string;
  email: string;
  address: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  address?: string;
}

// Environment variables
export interface EnvConfig {
  PORT: string;
  MONGO_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  CLIENT_URL?: string;
} 