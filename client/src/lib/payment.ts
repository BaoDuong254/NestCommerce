import envConfig from "@/lib/env";
import type { Order } from "@/types/order";

/**
 * Calculate total price of the order
 * @param order - Order object
 * @returns Total price as number
 */
export function calculateTotalPrice(order: Order): number {
  return order.items.reduce((total, item) => {
    return total + item.skuPrice * item.quantity;
  }, 0);
}

/**
 * Generate payment code based on payment ID
 * @param paymentId - Payment ID number
 * @returns Generated payment code string
 */
export function generatePaymentCode(paymentId: number): string {
  return `DH${paymentId.toString()}`;
}

/**
 * Generate QR Code URL for payment
 * @param order - Order object
 * @returns QR Code URL string
 */
export function generateQRCodeUrl(order: Order): string {
  const accountNumber = envConfig.VITE_BANK_ACCOUNT_NUMBER;
  const bankName = envConfig.VITE_BANK_NAME;
  const amount = calculateTotalPrice(order);
  const description = generatePaymentCode(order.paymentId);

  const params = new URLSearchParams({
    acc: accountNumber,
    bank: bankName,
    amount: amount.toString(),
    des: description,
  });

  return `https://qr.sepay.vn/img?${params.toString()}`;
}
