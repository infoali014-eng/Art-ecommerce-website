import { PaymentRepository } from '@/repositories/payment.repository';

import { StorageService } from './storage.service';

export const PaymentService = {
  validateCheckout(shipping: any, txId: string, screenshotFile: File | null) {
    if (!shipping.fullName || shipping.fullName.trim() === '') {
      throw new Error('Full Name is required.');
    }
    if (!shipping.phone || shipping.phone.trim() === '') {
      throw new Error('Phone number is required.');
    }
    if (!shipping.email || shipping.email.trim() === '') {
      throw new Error('Email is required.');
    }
    if (!shipping.province || shipping.province.trim() === '') {
      throw new Error('Province is required.');
    }
    if (!shipping.city || shipping.city.trim() === '') {
      throw new Error('City is required.');
    }
    if (!shipping.address || shipping.address.trim() === '') {
      throw new Error('Complete Address is required.');
    }
    if (!shipping.zip || shipping.zip.trim() === '') {
      throw new Error('Postal Code is required.');
    }
    if (!txId || txId.trim() === '') {
      throw new Error('Transaction ID / Reference ID is required.');
    }
    if (!screenshotFile) {
      throw new Error('Payment proof screenshot is required.');
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (screenshotFile.size > MAX_SIZE) {
      throw new Error('File size exceeds the 10 MB limit.');
    }

    // Validate file types
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(screenshotFile.type)) {
      throw new Error('Only PNG, JPG, JPEG, and WEBP files are allowed.');
    }
  },

  async createOrderAndPayment(
    order: any,
    items: any[],
    screenshotFile: File,
    userId: string
  ): Promise<any> {
    // 1. Upload screenshot to 'payment-proofs' storage bucket
    // Path layout: userId/timestamp_filename
    const timestamp = Date.now();
    const cleanFileName = screenshotFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `${userId}/${timestamp}_${cleanFileName}`;

    await StorageService.uploadFile('payment-proofs', storagePath, screenshotFile);
    const publicScreenshotUrl = StorageService.getPublicUrl('payment-proofs', storagePath);

    // 2. Set the screenshot details on the order payload
    const orderPayload = {
      ...order,
      paymentScreenshot: publicScreenshotUrl,
      paymentReference: order.paymentReference,
    };

    // 3. Create order
    const createdOrder = await PaymentRepository.createOrder(orderPayload, items);

    // 4. Create payment submission
    const submissionPayload = {
      orderId: createdOrder.id,
      userId: userId,
      paymentMethod: order.paymentMethod,
      paymentReference: order.paymentReference,
      paymentScreenshot: publicScreenshotUrl,
      amount: order.total,
    };

    await PaymentRepository.submitPayment(submissionPayload);

    return createdOrder;
  },

  async verifyPaymentSubmission(orderId: string, adminId: string, notes: string): Promise<void> {
    await PaymentRepository.verifyPayment(orderId, adminId, notes);
  },

  async rejectPaymentSubmission(orderId: string, adminId: string, notes: string): Promise<void> {
    await PaymentRepository.rejectPayment(orderId, adminId, notes);
  },
};

export default PaymentService;
