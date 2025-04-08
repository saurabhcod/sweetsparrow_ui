export interface Order {
    _id: string;
    products: string;
    userId: string;
    // paymentMethod: string;
    paymentStatus: boolean;
    status: string;
    address: string;
    isOrderCancle: boolean;
    isDeleted: boolean;
    deletedBy: string;
    deletedByModel: string;
    deletedAt: Date;
}

export interface CreateOrder {
    products: { productId: string; count: number }[];
    address: string;
}

