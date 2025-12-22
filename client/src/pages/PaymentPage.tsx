import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types/order";
import QRPayment from "@/components/QRPayment";
import { Loading } from "@/components/Loading";

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await orderService.getOrderDetail(Number(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Có lỗi xảy ra</h2>
          <p className='text-gray-600 mb-6'>{error ?? "Không thể tải thông tin đơn hàng"}</p>
          <button
            onClick={() => {
              void navigate("/");
            }}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors'
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <button
            onClick={() => {
              void navigate(-1);
            }}
            className='text-blue-500 hover:text-blue-600 flex items-center gap-2 font-semibold'
          >
            ← Quay lại
          </button>
        </div>

        <QRPayment order={order} />

        <div className='mt-6 bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Thông tin đơn hàng #{order.id}</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Trạng thái:</span>
              <span className='font-semibold text-orange-600'>{order.status}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Người nhận:</span>
              <span className='text-gray-900'>{order.receiver.name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Số điện thoại:</span>
              <span className='text-gray-900'>{order.receiver.phone}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Địa chỉ:</span>
              <span className='text-gray-900'>{order.receiver.address}</span>
            </div>
          </div>

          <div className='mt-4 pt-4 border-t border-gray-200'>
            <h4 className='font-semibold text-gray-800 mb-3'>Sản phẩm:</h4>
            <div className='space-y-3'>
              {order.items.map((item) => (
                <div key={item.id} className='flex justify-between text-sm'>
                  <div className='flex-1'>
                    <p className='text-gray-900 font-medium'>{item.productName}</p>
                    <p className='text-gray-500 text-xs'>{item.skuValue}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-900'>
                      {item.quantity} x {item.skuPrice.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className='text-gray-600 font-semibold'>
                      = {(item.quantity * item.skuPrice).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
