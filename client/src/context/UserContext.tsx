import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { User, PaginationData } from "../types";

// Action types
type UserAction =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_USERS";
      payload: { users: User[]; pagination: PaginationData };
    }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_USER"; payload: User | null };

// State interface
interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
}

// Context interface
interface UserContextType extends UserState {
  setLoading: (loading: boolean) => void;
  setUsers: (users: User[], pagination: PaginationData) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  setError: (error: string | null) => void;
  setCurrentUser: (user: User | null) => void;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Reducer
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_USERS":
      return {
        ...state,
        users: action.payload.users,
        pagination: action.payload.pagination,
        error: null,
      };

    case "ADD_USER":
      return {
        ...state,
        users: [action.payload, ...state.users],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        currentUser:
          state.currentUser?._id === action.payload._id
            ? action.payload
            : state.currentUser,
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1),
        },
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };

    default:
      return state;
  }
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setUsers = useCallback((users: User[], pagination: PaginationData) => {
    dispatch({ type: "SET_USERS", payload: { users, pagination } });
  }, []);

  const addUser = useCallback((user: User) => {
    dispatch({ type: "ADD_USER", payload: user });
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  }, []);

  const deleteUser = useCallback((userId: string) => {
    dispatch({ type: "DELETE_USER", payload: userId });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setCurrentUser = useCallback((user: User | null) => {
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  }, []);

  const contextValue: UserContextType = {
    ...state,
    setLoading,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    setError,
    setCurrentUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
