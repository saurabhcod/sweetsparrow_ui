export interface Product {
    _id: string;
    name: string;
    images: string;
    discription: string;
    price: number;
    // category: string;
    isAvailable: boolean;
    availableStock: number;
    isActive: boolean;
    rating: number;
    isDeleted: boolean;
    deletedBy: string;
    deletedByModel: string;
    deletedAt: Date;
}

export interface CreateProduct {
    name: string;
    images: string;
    discription: string;
    price: number;
}

export interface UpdateProduct {
    name?: string;
    images?: string;
    discription?: string;
    price?: number;
}