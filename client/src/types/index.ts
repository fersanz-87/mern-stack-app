// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interfaces
export interface UserFormData {
  name: string;
  email: string;
  address: string;
}

export interface FormErrors {
  [key: string]: string;
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

// Component props
export interface UserListProps {
  users: User[];
  onDelete: (userId: string) => void;
  loading: boolean;
}

export interface UserFormProps {
  user?: User;
  onSubmit: (userData: UserFormData) => void;
  loading: boolean;
  errors: FormErrors;
}

// Hook return types
export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
  updateUser: (userData: UserFormData) => Promise<void>;
  createUser: (userData: UserFormData) => Promise<void>;
} 