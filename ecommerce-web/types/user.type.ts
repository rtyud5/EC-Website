export type UserRole = "USER" | "ADMIN" | "SELLER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
