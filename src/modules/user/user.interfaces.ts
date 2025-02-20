export interface IUser{
    id: number;
    name: string,
    phone?: string | null,
    email: string,
    role: string

    createdAt: Date
    updatedAt: Date;
}


export interface IUserCreate {
    id: number;
    name: string,
    phone?: string,
    email: string,
    role: string
}

export interface IUpdateUser{
    id: number;
    name?: string;
    phone?: string;
    email?: string;
}