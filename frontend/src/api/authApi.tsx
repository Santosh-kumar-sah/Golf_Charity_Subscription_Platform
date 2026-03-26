// src/api/authApi.ts
import axiosInstance from "./axiosInstance";
import {type Subscription } from "./subscriptionApi"
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  subscription?: Subscription;
}

export interface AuthResponse {
  user: User;
}

// Register user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data.data;
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data.data;
};

// Logout user
export const logout = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data.data ?? response.data;
};

// Get current logged-in user
export const getMe = async (): Promise<User> => {
  const response = await axiosInstance.get("/auth/me");
  return response.data.data;
};