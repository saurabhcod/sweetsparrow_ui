export interface AdminUser {
    _id: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AdminSignup {
    email: string;
    password: string;
}

export interface AdminLogin {
    email: string;
    password: string;
}

export interface Pagination {
    page?: number;
    limit?: number;
    search?: string;
}