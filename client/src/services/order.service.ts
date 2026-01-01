import http from "@/lib/http";
import type { Order } from "@/types/order";

export const orderService = {
  async getOrderDetail(orderId: number): Promise<Order> {
    const response = await http.get<Order>(`/api/v1/orders/${orderId.toString()}`);
    return response.data;
  },
};
