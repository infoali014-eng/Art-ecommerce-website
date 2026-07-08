'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  AlertCircle,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  UploadCloud,
} from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { PaymentService } from '@/services/payment.service';
import { FRAME_PRICES } from '@/utils/calculateSubtotal';

import { Artwork, SiteSettings } from '@/types';

interface CheckoutFormClientProps {
  artwork: Artwork;
  selectedFrame: string;
  settings: SiteSettings;
}

export const CheckoutFormClient: React.FC<CheckoutFormClientProps> = ({
  artwork,
  selectedFrame,
  settings,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'bank_transfer'>('easypaisa');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNum, setCopiedNum] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBankNum, setCopiedBankNum] = useState(false);

  // Autofill email if authenticated
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  // Handle default active method based on settings
  useEffect(() => {
    if (settings.enableEasyPaisa === false && settings.enableBankTransfer === true) {
      setPaymentMethod('bank_transfer');
    }
  }, [settings]);

  const frameCost = FRAME_PRICES[selectedFrame] ?? 0;
  const shippingFee = 0; // Free shipping in Pakistan
  const grandTotal = artwork.price + frameCost;

  const handleCopyText = (text: string, type: 'number' | 'title' | 'bank_number') => {
    navigator.clipboard.writeText(text);
    if (type === 'number') {
      setCopiedNum(true);
      setTimeout(() => setCopiedNum(false), 2000);
    } else if (type === 'title') {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedBankNum(true);
      setTimeout(() => setCopiedBankNum(false), 2000);
    }
    addToast('Copied to clipboard!', 'info');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file size and type immediately for quick feedback
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        addToast('File size exceeds the 10 MB limit.', 'error');
        return;
      }
      const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowed.includes(file.type)) {
        addToast('Only PNG, JPG, JPEG, and WEBP files are allowed.', 'error');
        return;
      }

      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to complete your acquisition.', 'error');
      return;
    }

    const shippingData = { fullName, phone, email, province, city, address, zip };

    try {
      PaymentService.validateCheckout(shippingData, transactionId, screenshotFile);
    } catch (err: any) {
      addToast(err.message, 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingState: province,
        shippingZip: zip,
        shippingCountry: 'Pakistan',
        subtotal: artwork.price,
        discount: 0,
        shippingFee: shippingFee,
        total: grandTotal,
        paymentMethod: paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer',
        paymentReference: transactionId,
      };

      const orderItem = {
        artworkId: artwork.id,
        title: artwork.title,
        price: artwork.price,
        quantity: 1,
        frameOption: selectedFrame,
      };

      await PaymentService.createOrderAndPayment(
        orderPayload,
        [orderItem],
        screenshotFile!,
        user!.id
      );

      addToast('Order placed successfully! Pending payment verification.', 'success');
      router.push('/checkout/success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Section className="py-24 text-center">
        <Container className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-secondary text-xs font-light font-sans">Checking session state...</p>
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = `/login?redirectTo=/checkout/${artwork.slug}?frame=${selectedFrame}`;
    return (
      <Section className="py-24">
        <Container className="max-w-xl mx-auto">
          <div className="border border-primary/5 bg-white p-8 md:p-12 text-center rounded-sm shadow-sm">
            <AlertCircle className="w-12 h-12 text-accent mx-auto mb-6 stroke-[1.2]" />
            <h2 className="font-cormorant text-3xl font-light text-primary mb-4">
              Acquisition Authentication Required
            </h2>
            <p className="font-sans text-xs text-secondary font-light max-w-sm mx-auto mb-8 leading-relaxed">
              To place order and upload payment proofs safely, please log into your collector
              account. If you do not have an account, you can quickly register a new one.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="primary" size="md" onClick={() => router.push(redirectUrl)}>
                Login to Continue &rarr;
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() =>
                  router.push(
                    `/register?redirectTo=/checkout/${artwork.slug}?frame=${selectedFrame}`
                  )
                }
              >
                Create Account
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val * 280); // Converting to PKR for Pakistani users!
  };

  return (
    <Section padding="lg">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Shipping details */}
            <div className="bg-white border border-primary/5 p-6 md:p-8 rounded-sm shadow-sm space-y-4">
              <h2 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 03252538104"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    Province *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Punjab"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Daska"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 51010"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Complete Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street Address, Area / Block, Home / Appt number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                  Additional shipping instructions (optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
                />
              </div>
            </div>

            {/* Payment Verification section */}
            <div className="bg-white border border-primary/5 p-6 md:p-8 rounded-sm shadow-sm space-y-6">
              <div>
                <h2 className="font-cormorant text-2xl font-light text-primary tracking-wide mb-1">
                  Payment Verification
                </h2>
                <p className="text-[10px] text-secondary font-light font-sans leading-relaxed">
                  {settings.paymentInstructions ||
                    'Please transfer the grand total and provide screenshot below.'}
                </p>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 gap-4">
                {settings.enableEasyPaisa !== false && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-4 border text-left cursor-pointer flex flex-col justify-between h-20 transition-all ${
                      paymentMethod === 'easypaisa'
                        ? 'border-accent bg-accent/5'
                        : 'border-primary/5 bg-[#FAF8F5] hover:border-accent/45'
                    }`}
                  >
                    <span className="font-semibold text-primary text-xs font-sans">
                      EasyPaisa Account
                    </span>
                    <span className="text-[10px] text-secondary">Instant mobile transfer</span>
                  </button>
                )}
                {settings.enableBankTransfer !== false && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 border text-left cursor-pointer flex flex-col justify-between h-20 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-accent bg-accent/5'
                        : 'border-primary/5 bg-[#FAF8F5] hover:border-accent/45'
                    }`}
                  >
                    <span className="font-semibold text-primary text-xs font-sans">
                      Bank Transfer
                    </span>
                    <span className="text-[10px] text-secondary">Local bank transfer</span>
                  </button>
                )}
              </div>

              {/* Details and Copy Options */}
              {paymentMethod === 'easypaisa' ? (
                <div className="p-4 border border-primary/5 bg-[#FAF8F5] rounded space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-secondary font-light">Account Title:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        {settings.easyPaisaTitle || 'Abdul Manan Iqbal Mughal'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            settings.easyPaisaTitle || 'Abdul Manan Iqbal Mughal',
                            'title'
                          )
                        }
                        className="text-secondary hover:text-accent p-1 cursor-pointer bg-white border border-primary/5 rounded"
                      >
                        {copiedTitle ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-primary/5 pt-3">
                    <span className="text-secondary font-light">Mobile Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent text-sm">
                        {settings.easyPaisaNumber || '+92 325 2538104'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(settings.easyPaisaNumber || '+92 325 2538104', 'number')
                        }
                        className="text-secondary hover:text-accent p-1 cursor-pointer bg-white border border-primary/5 rounded"
                      >
                        {copiedNum ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-primary/5 bg-[#FAF8F5] rounded space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-secondary font-light">Bank Name:</span>
                    <span className="font-semibold text-primary">
                      {settings.bankName || 'Meezan Bank'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-primary/5 pt-3">
                    <span className="text-secondary font-light">Account Number / IBAN:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{settings.bankAccount}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(settings.bankAccount || '', 'bank_number')}
                        className="text-secondary hover:text-accent p-1 cursor-pointer bg-white border border-primary/5 rounded"
                      >
                        {copiedBankNum ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction screenshot proof */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    Upload Transaction screenshot *
                  </label>
                  <div className="relative border border-dashed border-primary/10 bg-[#FAF8F5] rounded-sm hover:bg-white transition-colors duration-300 p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px]">
                    <input
                      type="file"
                      required
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-accent stroke-[1.2] mb-3" />
                    <span className="text-xs text-primary font-semibold block mb-1">
                      {screenshotFile ? screenshotFile.name : 'Select receipt screenshot'}
                    </span>
                    <span className="text-[10px] text-secondary font-light">
                      PNG, JPG, JPEG, WEBP up to 10 MB
                    </span>
                  </div>
                </div>

                {screenshotPreview && (
                  <div className="relative aspect-video w-full max-w-[200px] border border-primary/5 bg-background overflow-hidden rounded">
                    <Image
                      src={screenshotPreview}
                      alt="Proof Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                    Transaction ID / Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter the 11-digit or bank receipt ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-sm font-sans"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Checkout Summary Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-primary/5 p-6 md:p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                Acquisition Summary
              </h2>

              {/* Product preview */}
              <div className="flex gap-4">
                <div className="relative aspect-[3/4] w-20 bg-background border border-primary/5 shrink-0 overflow-hidden">
                  <Image
                    src={artwork.images[0]}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="font-sans text-xs space-y-1 flex-grow">
                  <h3 className="font-cormorant text-lg font-medium text-primary leading-tight">
                    {artwork.title}
                  </h3>
                  <p className="text-secondary italic">By {artwork.artist}</p>
                  <div className="text-[10px] text-secondary flex flex-col gap-0.5 pt-1 uppercase tracking-wider">
                    <span>
                      Frame:{' '}
                      <strong className="text-primary font-medium">
                        {selectedFrame === 'none' ? 'No Frame' : selectedFrame}
                      </strong>
                    </span>
                    <span>Medium: {artwork.medium}</span>
                  </div>
                </div>
              </div>

              {/* Price details */}
              <div className="space-y-3 pt-4 border-t border-primary/5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-secondary font-light">Artwork Subtotal</span>
                  <span className="text-primary font-medium">{formatCurrency(artwork.price)}</span>
                </div>
                {selectedFrame !== 'none' && (
                  <div className="flex justify-between">
                    <span className="text-secondary font-light">Premium Frame Cost</span>
                    <span className="text-primary font-medium">{formatCurrency(frameCost)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-secondary font-light">Shipping Fee</span>
                  <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px]">
                    Free Shipping
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-primary/5 text-sm font-semibold">
                  <span className="text-primary">Grand Total</span>
                  <span className="text-accent text-lg">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Security COA Badge */}
              <div className="bg-[#FAF8F5] border border-primary/5 p-4 rounded flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-xs font-sans">
                  <span className="font-semibold text-primary block">Collector Protection</span>
                  <span className="text-[10px] text-secondary font-light leading-relaxed">
                    Certificate of Authenticity (COA) hand-signed by the artist is included inside
                    your shipment package.
                  </span>
                </div>
              </div>

              {/* Final Submit action */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Processing Order...' : 'Complete Acquisition'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CheckoutFormClient;
