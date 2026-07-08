import { createClient } from '@/lib/supabase/client';

const supabase = createClient() as any;

export const PaymentRepository = {
  async createOrder(order: any, items: any[]): Promise<any> {
    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order.userId || null,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone || null,
        shipping_address: order.shippingAddress,
        shipping_city: order.shippingCity,
        shipping_state: order.shippingState || null,
        shipping_zip: order.shippingZip,
        shipping_country: order.shippingCountry,
        subtotal: order.subtotal,
        discount: order.discount || 0,
        shipping_fee: order.shippingFee || 0,
        total: order.total,
        status: 'Pending Payment',
        payment_status: 'Pending Payment',
        payment_method: order.paymentMethod,
        transaction_id: order.transactionId || null,
        payment_reference: order.paymentReference || null,
        payment_screenshot: order.paymentScreenshot || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const orderItemsPayload = items.map((item) => ({
      order_id: orderData.id,
      artwork_id: item.artworkId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      frame_option: item.frameOption,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);

    if (itemsError) throw itemsError;

    return orderData;
  },

  async submitPayment(submission: any): Promise<any> {
    const { data, error } = await supabase
      .from('payment_submissions')
      .insert({
        order_id: submission.orderId,
        user_id: submission.userId,
        payment_method: submission.paymentMethod,
        payment_reference: submission.paymentReference,
        payment_screenshot: submission.paymentScreenshot,
        amount: submission.amount,
        status: 'Payment Submitted',
        admin_notes: null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPaymentSubmission(orderId: string): Promise<any> {
    const { data, error } = await supabase
      .from('payment_submissions')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async verifyPayment(orderId: string, adminId: string, notes: string): Promise<void> {
    // 1. Update order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'Processing',
        payment_status: 'Verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        payment_notes: notes || 'Payment verified by administrator',
      })
      .eq('id', orderId);

    if (orderError) throw orderError;

    // 2. Update payment submission
    const { error: subError } = await supabase
      .from('payment_submissions')
      .update({
        status: 'Verified',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        admin_notes: notes || 'Payment verified',
      })
      .eq('order_id', orderId);

    if (subError) throw subError;
  },

  async rejectPayment(orderId: string, adminId: string, notes: string): Promise<void> {
    // 1. Update order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'Pending Payment',
        payment_status: 'Rejected',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        payment_notes: notes || 'Payment rejected by administrator',
      })
      .eq('id', orderId);

    if (orderError) throw orderError;

    // 2. Update payment submission
    const { error: subError } = await supabase
      .from('payment_submissions')
      .update({
        status: 'Rejected',
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        admin_notes: notes || 'Payment rejected',
      })
      .eq('order_id', orderId);

    if (subError) throw subError;
  },

  async getPendingPayments(): Promise<any[]> {
    const { data, error } = await supabase
      .from('payment_submissions')
      .select('*, orders(*, order_items(*))')
      .eq('status', 'Payment Submitted')
      .order('submitted_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateOrderPaymentStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) throw error;
  },
};

export default PaymentRepository;
