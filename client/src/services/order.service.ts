import http from "@/lib/http";
import type { Order } from "@/types/order";

export const orderService = {
  async getOrderDetail(orderId: number): Promise<Order> {
    const response = await http.get<Order>(`/orders/${orderId.toString()}`);
    return response.data;
  },
};
