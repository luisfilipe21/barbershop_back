import { Role } from "@prisma/client";

export interface IUser {
  id: number;
  name: string;
  password: string;
  phone?: string | null;
  email: string;
  role: Role;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  name: string;
  password: string;
  phone?: string;
  email: string;
  role: Role;
}

export interface IUserUpdate {
  name?: string;
  password?: string;
  phone?: string;
  email?: string;
}

export interface IUserReturn {
  name: string;
  phone?: string;
  email: string;
}
