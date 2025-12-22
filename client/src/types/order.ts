export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productTranslations: unknown[];
  skuPrice: number;
  image: string;
  skuValue: string;
  skuId: number;
  orderId: number;
  quantity: number;
  createdAt: string;
}

export interface OrderReceiver {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  receiver: OrderReceiver;
  shopId: number;
  paymentId: number;
  createdById: number;
  updatedById: number | null;
  deletedById: number | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
