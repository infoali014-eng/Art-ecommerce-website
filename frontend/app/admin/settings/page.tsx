'use client';

import React, { useEffect, useState } from 'react';

import { CreditCard, Globe, Mail, Phone, Save, Settings, ShieldAlert } from 'lucide-react';

import LoadingButton from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AdminRepository } from '@/repositories/admin.repository';
import { AdminService } from '@/services/admin.service';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [siteName, setSiteName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [easyPaisaNumber, setEasyPaisaNumber] = useState('');
  const [easyPaisaTitle, setEasyPaisaTitle] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [enableEasyPaisa, setEnableEasyPaisa] = useState(false);
  const [enableBankTransfer, setEnableBankTransfer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const settings = await AdminRepository.getSiteSettings();
      setSiteName(settings.siteName);
      setContactEmail(settings.contactEmail);
      setContactPhone(settings.contactPhone);
      setMaintenanceMode(settings.maintenanceMode);
      setHeroTitle(settings.heroTitle);
      setHeroSubtitle(settings.heroSubtitle);
      setEasyPaisaNumber(settings.easyPaisaNumber || '');
      setEasyPaisaTitle(settings.easyPaisaTitle || '');
      setBankName(settings.bankName || '');
      setBankAccount(settings.bankAccount || '');
      setPaymentInstructions(settings.paymentInstructions || '');
      setEnableEasyPaisa(settings.enableEasyPaisa ?? false);
      setEnableBankTransfer(settings.enableBankTransfer ?? false);
    } catch (e) {
      console.error(e);
      addToast('Failed to load global settings configurations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveLoading) return;

    setSaveLoading(true);
    try {
      const adminId = user?.id || null;
      await AdminService.updateSiteSettings(adminId, {
        siteName,
        contactEmail,
        contactPhone,
        maintenanceMode,
        heroTitle,
        heroSubtitle,
        easyPaisaNumber,
        easyPaisaTitle,
        bankName,
        bankAccount,
        paymentInstructions,
        enableEasyPaisa,
        enableBankTransfer,
      });
      addToast('Site settings updated successfully.', 'success');
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Failed to update configurations.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 border border-primary/5 rounded text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
        <span className="text-xs text-secondary/60 font-light">Loading settings config...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-3xl">
      {/* Header */}
      <div className="border-b border-primary/5 pb-4">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
          GLOBAL CONFIGURATIONS
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide">
          Settings Console
        </h1>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        className="space-y-6 text-xs text-secondary bg-white border border-primary/5 p-6 md:p-8 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
      >
        {/* Core Metadata */}
        <div className="space-y-4">
          <h3 className="font-cormorant text-lg text-primary font-medium tracking-wide border-b border-primary/5 pb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2 text-accent stroke-[1.5]" />
            <span>Store Metadata</span>
          </h3>
          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Website Name *
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm font-semibold text-primary"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-cormorant text-lg text-primary font-medium tracking-wide border-b border-primary/5 pb-2 flex items-center pt-2">
            <Mail className="w-4 h-4 mr-2 text-accent stroke-[1.5]" />
            <span>Customer Contact Inquiries</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Contact Email Address *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Home Text Info */}
        <div className="space-y-4">
          <h3 className="font-cormorant text-lg text-primary font-medium tracking-wide border-b border-primary/5 pb-2 flex items-center pt-2">
            <Settings className="w-4 h-4 mr-2 text-accent stroke-[1.5]" />
            <span>Homepage Curation Banner</span>
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Main Hero Banner Title
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
              />
            </div>
          </div>
        </div>

        {/* Payment Configurations */}
        <div className="space-y-4">
          <h3 className="font-cormorant text-lg text-primary font-medium tracking-wide border-b border-primary/5 pb-2 flex items-center pt-2">
            <CreditCard className="w-4 h-4 mr-2 text-accent stroke-[1.5]" />
            <span>Payment & Checkout Configurations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                EasyPaisa Account Title
              </label>
              <input
                type="text"
                value={easyPaisaTitle}
                onChange={(e) => setEasyPaisaTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                EasyPaisa Mobile Account Number
              </label>
              <input
                type="text"
                value={easyPaisaNumber}
                onChange={(e) => setEasyPaisaNumber(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                Bank Account Number / IBAN
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Payment Checkout Instructions
            </label>
            <textarea
              rows={3}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-primary/5 px-3 py-2.5 focus:outline-none focus:border-accent rounded-sm resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#FAF8F5] border border-primary/5 p-4 rounded flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-primary text-[11px] block">
                  Enable EasyPaisa Payment
                </span>
                <p className="text-[9px] text-secondary font-light font-sans">
                  Allows customers to pay using EasyPaisa transfer.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableEasyPaisa}
                  onChange={(e) => setEnableEasyPaisa(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-primary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
              </label>
            </div>

            <div className="bg-[#FAF8F5] border border-primary/5 p-4 rounded flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-primary text-[11px] block">
                  Enable Bank Transfer
                </span>
                <p className="text-[9px] text-secondary font-light font-sans">
                  Allows customers to pay using direct Bank transfer.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableBankTransfer}
                  onChange={(e) => setEnableBankTransfer(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-primary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="space-y-4">
          <h3 className="font-cormorant text-lg text-primary font-medium tracking-wide border-b border-primary/5 pb-2 flex items-center pt-2">
            <ShieldAlert className="w-4 h-4 mr-2 text-accent stroke-[1.5]" />
            <span>Security & Maintenance State</span>
          </h3>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded flex items-center justify-between">
            <div className="space-y-0.5 max-w-md">
              <span className="font-semibold text-amber-800 text-[11px] block">
                Toggle Maintenance Lock Mode
              </span>
              <p className="text-[10px] text-amber-700/80 font-light leading-relaxed font-sans">
                When activated, public catalog pages are locked behind a maintenance message screen
                for visitors. Authenticated admins can still edit.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-primary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-primary/5 flex justify-end">
          <LoadingButton type="submit" variant="primary" loading={saveLoading}>
            {!saveLoading && <Save className="w-4 h-4 mr-2 inline-block" />}Save Configurations
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
