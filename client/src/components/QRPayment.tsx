import envConfig from "@/lib/env";
import { calculateTotalPrice, generatePaymentCode } from "@/lib/payment";
import type { Order } from "@/types/order";

interface QRPaymentProps {
  order: Order;
}

export default function QRPayment({ order }: QRPaymentProps) {
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

  const qrCodeUrl = `https://qr.sepay.vn/img?${params.toString()}`;

  return (
    <div className='flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-lg'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Thanh toán đơn hàng</h2>
        <p className='text-gray-600'>Quét mã QR để hoàn tất thanh toán</p>
      </div>

      <div className='bg-white p-4 rounded-lg border-2 border-gray-200'>
        <img src={qrCodeUrl} alt='QR Code thanh toán' className='w-64 h-64 object-contain' />
      </div>

      <div className='w-full space-y-3 text-sm'>
        <div className='flex justify-between p-3 bg-gray-50 rounded'>
          <span className='font-semibold text-gray-700'>Ngân hàng:</span>
          <span className='text-gray-900'>{bankName}</span>
        </div>
        <div className='flex justify-between p-3 bg-gray-50 rounded'>
          <span className='font-semibold text-gray-700'>Số tài khoản:</span>
          <span className='text-gray-900'>{accountNumber}</span>
        </div>
        <div className='flex justify-between p-3 bg-gray-50 rounded'>
          <span className='font-semibold text-gray-700'>Số tiền:</span>
          <span className='text-gray-900 font-bold text-lg'>{amount.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className='flex justify-between p-3 bg-gray-50 rounded'>
          <span className='font-semibold text-gray-700'>Nội dung:</span>
          <span className='text-gray-900 font-mono'>{description}</span>
        </div>
      </div>

      <div className='w-full bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
        <p className='text-sm text-blue-800'>
          <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung{" "}
          <span className='font-mono font-bold'>{description}</span> để hệ thống tự động xác nhận thanh toán.
        </p>
      </div>
    </div>
  );
}
