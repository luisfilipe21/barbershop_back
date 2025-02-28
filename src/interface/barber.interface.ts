import { AvailableTime, Role, Schedule } from "@prisma/client";

export interface IBarber {
  id: number;
  name: string;
  password: string;
  email: string;
  phone?: string | null;
  role: Role;

  createdAt: Date;
  updatedAt: Date;

  Schedule?: Schedule | null;
  AvailableTime?: AvailableTime | null;
}

export interface IBarberCreate {
  name: string;
  password: string;
  email: string;
  phone?: string;
  role: Role;

}

export interface IBarberUpdate {
  name?: string;
  password?: string;
  email?: string;
  phone?: string;

}

export interface IBarberReturn {
    name: string;
    email: string;
    phone?: string;
    Schedule?: string[];
    AvailableTime?: string[];
  }

