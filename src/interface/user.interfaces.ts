
export interface IUser {
  id: number;
  name: string;
  password: string;
  phone?: string | null;
  email: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  name: string;
  password: string;
  phone?: string;
  email: string;
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
